/**
 * Computes the chamfer (beveled corner) points for a given vertex of a polygon.
 *
 * Mathematical approach:
 * Given a polygon vertex `curr` and its adjacent vertices `prev` and `next`, this function computes two new points:
 * - `pAlongPrev`: a point along the edge from `curr` to `prev`
 * - `pAlongNext`: a point along the edge from `curr` to `next`
 * These points are positioned such that, if the corner at `curr` is replaced by the segment connecting `pAlongPrev` and `pAlongNext`,
 * the resulting shape has a chamfer (beveled) corner with the specified chamfer length and angle.
 *
 * The function works by:
 * 1. Calculating normalized direction vectors from `curr` to `prev` and `curr` to `next`.
 * 2. Determining the angle between these vectors.
 * 3. Using trigonometry to compute the distance along each edge such that the segment between the two new points forms the desired chamfer.
 * 4. Handling degenerate cases (colinear or zero-length edges) by returning the original vertex.
 *
 * Parameters:
 * @param curr - The current vertex (corner) to chamfer.
 * @param prev - The previous vertex in the polygon (defines one adjacent edge).
 * @param next - The next vertex in the polygon (defines the other adjacent edge).
 * @param angleDeg - The chamfer angle in degrees (typically the angle of the beveled corner).
 * @param length - The length of the chamfer (distance from `curr` along each adjacent edge).
 *
 * @returns An object with:
 *   - `pAlongPrev`: The new point along the edge from `curr` to `prev`.
 *   - `pAlongNext`: The new point along the edge from `curr` to `next`.
 * If the chamfer cannot be computed (e.g., edges are colinear or too short), both points will be equal to `curr`.
 *
 * Assumptions:
 * - The input points are in 2D Cartesian coordinates.
 * - The polygon is simple (non-self-intersecting).
 * - The function does not modify the input points.
 */

import { Line, Rect, Circle, Path } from 'react-konva';
import { ElementItem, ElementItems } from 'types/part';

export type Point = { x: number; y: number };

// simple cache by element signature
const ELEMENT_SHAPE_CACHE_MAX = 1000;
const elementShapeCache = new Map<string, any>();
const elementShapeCacheOrder: string[] = [];

function cacheGet(key: string) {
  return elementShapeCache.get(key);
}
function cacheSet(key: string, value: any) {
  if (!elementShapeCache.has(key)) {
    elementShapeCacheOrder.push(key);
    if (elementShapeCacheOrder.length > ELEMENT_SHAPE_CACHE_MAX) {
      const oldest = elementShapeCacheOrder.shift()!;
      elementShapeCache.delete(oldest);
    }
  }
  elementShapeCache.set(key, value);
}

function elementSignature(
  element: ElementItem,
  defaultColor: string,
  defaultOpacity: number,
): string {
  const left = element.corners?.left
    ? {
        type: element.corners.left.type,
        radius: (element.corners.left as any).radius,
        radiusType: (element.corners.left as any).radiusType,
        length: (element.corners.left as any).length,
        angle: (element.corners.left as any).angle,
      }
    : undefined;
  const right = element.corners?.right
    ? {
        type: element.corners.right.type,
        radius: (element.corners.right as any).radius,
        radiusType: (element.corners.right as any).radiusType,
        length: (element.corners.right as any).length,
        angle: (element.corners.right as any).angle,
      }
    : undefined;

  // signature with only fields relevant to the shape
  const sig = {
    id: element.id,
    label: element.label,
    leftDiameter: element.leftDiameter,
    rightDiameter: element.rightDiameter,
    leftZAxis: element.leftZAxis,
    rightZAxis: element.rightZAxis,
    xaxis: element.xaxis,
    corners: { left, right },
    defaultColor,
    defaultOpacity,
  };
  return JSON.stringify(sig);
}

// geometric helpers (centralized)
const EPS = 1e-9;
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));
const cross = (a: Point, b: Point) => a.x * b.y - a.y * b.x;
const dot = (a: Point, b: Point) => a.x * b.x + a.y * b.y;
const norm = (v: Point) => Math.hypot(v.x, v.y);
const normalize = (v: Point): Point => {
  const l = norm(v);
  return l < EPS ? { x: 0, y: 0 } : { x: v.x / l, y: v.y / l };
};

// generic chamfer calculation for a corner (reused)
function computeChamfer(
  curr: Point,
  prev: Point,
  next: Point,
  angleDeg: number,
  length: number,
): { pAlongPrev: Point; pAlongNext: Point } {
  const v1 = { x: prev.x - curr.x, y: prev.y - curr.y };
  const v2 = { x: next.x - curr.x, y: next.y - curr.y };
  const lenV1 = norm(v1);
  const lenV2 = norm(v2);
  if (lenV1 < EPS || lenV2 < EPS) return { pAlongPrev: curr, pAlongNext: curr };

  const u1 = normalize(v1);
  const u2 = normalize(v2);

  // degenerate corners (collinear edges)
  const det = cross(u1, u2);
  if (Math.abs(det) < EPS) return { pAlongPrev: curr, pAlongNext: curr };

  // corner internal angle
  const cosPhi = clamp(dot(u1, u2), -1, 1);
  const phi = Math.acos(cosPhi);
  if (phi < 1e-6) return { pAlongPrev: curr, pAlongNext: curr };

  // padronize: measure angle always from the most "vertical" edge
  const alpha = clamp(Math.abs(angleDeg) * (Math.PI / 180), EPS, phi - EPS);

  // find vertical vector
  const u1IsVert = Math.abs(u1.x) < Math.abs(u1.y);

  // Feed rate in each area to obtain the chamfer direction with angle 'alpha' relative to uVert
  // sVert : sHorz = sin(phi - alpha) : sin(alpha)
  const rVert = Math.sin(phi - alpha);
  const rHorz = Math.sin(alpha);

  // Scale k such that the chamfer segment has length "length"
  // |sHorz*uH - sVert*uV|^2 = sHorz^2 + sVert^2 - 2*sHorz*sVert*cos(phi)
  const denomSq = rHorz * rHorz + rVert * rVert - 2 * rHorz * rVert * cosPhi;
  const k = denomSq > EPS ? length / Math.sqrt(denomSq) : 0;

  const sVert = k * rVert;
  const sHorz = k * rHorz;

  // map back to s1 (prev/u1) and s2 (next/u2)
  let s1 = u1IsVert ? sVert : sHorz;
  let s2 = u1IsVert ? sHorz : sVert;

  // limits to not exceed adjacent vertices
  const max1 = lenV1 * 0.999;
  const max2 = lenV2 * 0.999;
  const scale = Math.min(1, max1 / s1, max2 / s2);
  s1 *= scale;
  s2 *= scale;

  return {
    pAlongPrev: { x: curr.x + u1.x * s1, y: curr.y + u1.y * s1 },
    pAlongNext: { x: curr.x + u2.x * s2, y: curr.y + u2.y * s2 },
  };
}

export function applyChamferToPolygon(
  polygon: Point[],
  vertexIndex: number,
  angleDeg: number,
  length: number,
): Point[] {
  const n = polygon.length;
  if (n < 3) return polygon.slice();

  const i = ((vertexIndex % n) + n) % n;
  const prev = polygon[(i - 1 + n) % n];
  const curr = polygon[i];
  const next = polygon[(i + 1) % n];

  const { pAlongPrev, pAlongNext } = computeChamfer(
    curr,
    prev,
    next,
    angleDeg,
    length,
  );
  // if invalid, return copy
  if (
    (pAlongPrev.x === curr.x && pAlongPrev.y === curr.y) ||
    (pAlongNext.x === curr.x && pAlongNext.y === curr.y)
  ) {
    return polygon.slice();
  }

  const out: Point[] = [];
  for (let k = 0; k < n; k += 1) {
    if (k === i) out.push(pAlongPrev, pAlongNext);
    else out.push(polygon[k]);
  }
  return out;
}

export function convertElementsToPolygons(
  elementItems: ElementItems,
  defaultColor: string,
  defaultOpacity: number = 0.9,
): any[] {
  return elementItems.map((element: ElementItem) => {
    // cache by element
    const cacheKey = elementSignature(element, defaultColor, defaultOpacity);
    const cached = cacheGet(cacheKey);
    if (cached) return cached;

    const leftHalfHeight = element.leftDiameter / 2;
    const rightHalfHeight = element.rightDiameter / 2;
    const leftX = element.leftZAxis;
    const rightX = element.rightZAxis;

    // path system (inverted Y)
    const TL = { x: leftX, y: -(element.xaxis - leftHalfHeight) };
    const TR = { x: rightX, y: -(element.xaxis - rightHalfHeight) };
    const BR = { x: rightX, y: -(element.xaxis + rightHalfHeight) };
    const BL = { x: leftX, y: -(element.xaxis + leftHalfHeight) };

    const leftCorner = element.corners?.left ?? { type: 'none' };
    const rightCorner = element.corners?.right ?? { type: 'none' };
    const hasAnyTreatment =
      leftCorner.type !== 'none' || rightCorner.type !== 'none';

    if (hasAnyTreatment) {
      const topAngle = Math.atan2(TR.y - TL.y, TR.x - TL.x);
      const bottomAngle = Math.atan2(BR.y - BL.y, BR.x - BL.x);

      const leftRadius =
        leftCorner.type === 'rounded' ? (leftCorner as any).radius : 0;
      const rightRadius =
        rightCorner.type === 'rounded' ? (rightCorner as any).radius : 0;

      const leftRadiusType: 'convex' | 'concave' =
        leftCorner.type === 'rounded' &&
        (leftCorner as any).radiusType === 'concave'
          ? 'concave'
          : 'convex';
      const rightRadiusType: 'convex' | 'concave' =
        rightCorner.type === 'rounded' &&
        (rightCorner as any).radiusType === 'concave'
          ? 'concave'
          : 'convex';

      const tl = leftRadius;
      const bl = leftRadius;
      const tr = rightRadius;
      const br = rightRadius;

      const tlOffsetX = tl ? tl / Math.tan((Math.PI / 2 + topAngle) / 2) : 0;
      const tlOffsetY = tl ? tlOffsetX * Math.tan(topAngle) : 0;
      const trOffsetX = tr ? tr / Math.tan((Math.PI / 2 - topAngle) / 2) : 0;
      const trOffsetY = tr ? trOffsetX * Math.tan(topAngle) : 0;

      const blOffsetX = bl ? bl / Math.tan((Math.PI / 2 - bottomAngle) / 2) : 0;
      const blOffsetY = bl ? blOffsetX * Math.tan(bottomAngle) : 0;
      const brOffsetX = br ? br / Math.tan((Math.PI / 2 + bottomAngle) / 2) : 0;
      const brOffsetY = br ? brOffsetX * Math.tan(bottomAngle) : 0;

      const p1 = { x: TL.x + tlOffsetX, y: TL.y + tlOffsetY };
      const p8 = { x: TL.x, y: TL.y - tlOffsetX };
      const p2 = { x: TR.x - trOffsetX, y: TR.y - trOffsetY };
      const p3 = { x: TR.x, y: TR.y - trOffsetX };
      const p4 = { x: BR.x, y: BR.y + brOffsetX };
      const p5 = { x: BR.x - brOffsetX, y: BR.y - brOffsetY };
      const p6 = { x: BL.x + blOffsetX, y: BL.y + blOffsetY };
      const p7 = { x: BL.x, y: BL.y + blOffsetX };

      const leftChamfer =
        leftCorner.type === 'chamfer'
          ? {
              length: (leftCorner as any).length,
              angle: (leftCorner as any).angle,
            }
          : null;
      const rightChamfer =
        rightCorner.type === 'chamfer'
          ? {
              length: (rightCorner as any).length,
              angle: (rightCorner as any).angle,
            }
          : null;

      // calculate chamfer (if exists)
      const chamTL = leftChamfer
        ? computeChamfer(TL, BL, TR, leftChamfer.angle, leftChamfer.length)
        : null;
      const chamBL = leftChamfer
        ? computeChamfer(BL, BR, TL, leftChamfer.angle, leftChamfer.length)
        : null;
      const chamTR = rightChamfer
        ? computeChamfer(TR, TL, BR, rightChamfer.angle, rightChamfer.length)
        : null;
      const chamBR = rightChamfer
        ? computeChamfer(BR, TR, BL, rightChamfer.angle, rightChamfer.length)
        : null;

      const nearX = (p: Point, xRef: number) => Math.abs(p.x - xRef);

      const tlTop =
        chamTL &&
        (nearX(chamTL.pAlongPrev, TL.x) < nearX(chamTL.pAlongNext, TL.x)
          ? chamTL.pAlongNext
          : chamTL.pAlongPrev);
      const tlVert =
        chamTL &&
        (nearX(chamTL.pAlongPrev, TL.x) < nearX(chamTL.pAlongNext, TL.x)
          ? chamTL.pAlongPrev
          : chamTL.pAlongNext);
      const blVert =
        chamBL &&
        (nearX(chamBL.pAlongPrev, BL.x) < nearX(chamBL.pAlongNext, BL.x)
          ? chamBL.pAlongPrev
          : chamBL.pAlongNext);

      const trTop =
        chamTR &&
        (nearX(chamTR.pAlongPrev, TR.x) < nearX(chamTR.pAlongNext, TR.x)
          ? chamTR.pAlongNext
          : chamTR.pAlongPrev);
      const trVert =
        chamTR &&
        (nearX(chamTR.pAlongPrev, TR.x) < nearX(chamTR.pAlongNext, TR.x)
          ? chamTR.pAlongPrev
          : chamTR.pAlongNext);

      const brBottom =
        chamBR &&
        (nearX(chamBR.pAlongPrev, BR.x) < nearX(chamBR.pAlongNext, BR.x)
          ? chamBR.pAlongNext
          : chamBR.pAlongPrev);
      const brVert =
        chamBR &&
        (nearX(chamBR.pAlongPrev, BR.x) < nearX(chamBR.pAlongNext, BR.x)
          ? chamBR.pAlongPrev
          : chamBR.pAlongNext);

      // start and end of the top border
      const startTop: Point = (() => {
        if (leftCorner.type === 'rounded') return p1;
        if (leftCorner.type === 'chamfer') return tlTop as Point;
        return TL;
      })();
      let endTop: Point;
      if (rightCorner.type === 'rounded') {
        endTop = p2;
      } else if (rightCorner.type === 'chamfer') {
        endTop = trTop as Point;
      } else {
        endTop = TR;
      }

      let d = `M ${startTop.x} ${startTop.y} L ${endTop.x} ${endTop.y} `;

      // right top corner
      if (rightCorner.type === 'rounded' && tr > 0)
        d += `A ${tr} ${tr} 0 0 ${rightRadiusType === 'concave' ? 1 : 0} ${
          p3.x
        } ${p3.y} `;
      else if (rightCorner.type === 'chamfer' && trVert)
        d += `L ${trVert.x} ${trVert.y} `;

      // right border down
      let rightDown: Point;
      if (rightCorner.type === 'rounded') {
        rightDown = p4;
      } else if (rightCorner.type === 'chamfer') {
        rightDown = brVert ?? BR;
      } else {
        rightDown = BR;
      }
      d += `L ${rightDown.x} ${rightDown.y} `;

      // right bottom corner
      if (rightCorner.type === 'rounded' && br > 0)
        d += `A ${br} ${br} 0 0 ${rightRadiusType === 'concave' ? 1 : 0} ${
          p5.x
        } ${p5.y} `;
      else if (rightCorner.type === 'chamfer' && brBottom)
        d += `L ${brBottom.x} ${brBottom.y} `;

      // right bottom border (right -> left)
      const blBottom =
        chamBL &&
        (nearX(chamBL.pAlongPrev, BL.x) < nearX(chamBL.pAlongNext, BL.x)
          ? chamBL.pAlongNext
          : chamBL.pAlongPrev);
      let endBottomLeft: Point;
      if (leftCorner.type === 'rounded') {
        endBottomLeft = p6;
      } else if (leftCorner.type === 'chamfer') {
        endBottomLeft = blBottom as Point;
      } else {
        endBottomLeft = BL;
      }
      d += `L ${endBottomLeft.x} ${endBottomLeft.y} `;

      // left bottom corner
      if (leftCorner.type === 'rounded' && bl > 0)
        d += `A ${bl} ${bl} 0 0 ${leftRadiusType === 'concave' ? 1 : 0} ${
          p7.x
        } ${p7.y} `;
      else if (leftCorner.type === 'chamfer' && blVert)
        d += `L ${blVert.x} ${blVert.y} `;

      // left border (up)
      let leftUp: Point;
      if (leftCorner.type === 'rounded') {
        leftUp = p8;
      } else if (leftCorner.type === 'chamfer') {
        leftUp = tlVert as Point;
      } else {
        leftUp = TL;
      }
      d += `L ${leftUp.x} ${leftUp.y} `;

      // left top corner and close path
      if (leftCorner.type === 'rounded' && tl > 0)
        d += `A ${tl} ${tl} 0 0 ${leftRadiusType === 'concave' ? 1 : 0} ${
          p1.x
        } ${p1.y} `;
      else if (leftCorner.type === 'chamfer' && tlTop)
        d += `L ${tlTop.x} ${tlTop.y} `;
      d += 'Z';

      const shape = {
        type: 'path',
        data: d,
        fill: defaultColor,
        opacity: defaultOpacity,
        id: element.id,
        label: element.label,
      };
      cacheSet(cacheKey, shape);
      return shape;
    }

    // without treatments: simple polygon (reverse Y for the Line)
    const points = [TL.x, -TL.y, TR.x, -TR.y, BR.x, -BR.y, BL.x, -BL.y];
    const shape = {
      type: 'polygon',
      points,
      fill: defaultColor,
      opacity: defaultOpacity,
      id: element.id,
      label: element.label,
    };
    cacheSet(cacheKey, shape);
    return shape;
  });
}

export function renderShapesAndPoints({
  points,
  elementItems,
  selectedShape,
  strokeWidth,
  colors,
  handleShapeClick,
  zoomLevel,
  focusedPointId,
}: {
  points: any[];
  elementItems: ElementItem[];
  selectedShape: string | undefined;
  strokeWidth: number;
  colors: any;
  handleShapeClick: (id: string) => void;
  zoomLevel: number;
  focusedPointId?: string;
}) {
  const elementShapes = elementItems
    ? convertElementsToPolygons(elementItems, colors.silver)
    : [];

  const strokeOf = (id: string) =>
    selectedShape === id ? 'blue' : colors.greyFont;
  const strokeWOf = (id: string) =>
    selectedShape === id ? strokeWidth * 2 : strokeWidth;

  // group points by contour
  const contourGroups = new Map<string, any[]>();

  points.forEach((point) => {
    // extract contour ID from point ID (format: "point-{contourId}-{index}")
    const idParts = point.id.split('-');
    if (idParts.length >= 2) {
      const contourId = idParts[1];
      if (!contourGroups.has(contourId)) {
        contourGroups.set(contourId, []);
      }
      contourGroups.get(contourId)?.push(point);
    }
  });

  return (
    <>
      {elementShapes.map((shape) => {
        if (shape.type === 'rect') {
          return (
            <Rect
              key={shape.id}
              x={shape.x}
              y={-(shape.y ?? 0)}
              width={shape.width}
              height={shape.height}
              fill={shape.fill}
              stroke={strokeOf(shape.id)}
              strokeWidth={strokeWOf(shape.id)}
              opacity={shape.opacity}
              onClick={() => handleShapeClick(shape.id)}
            />
          );
        }
        if (shape.type === 'polygon') {
          return (
            <Line
              key={shape.id}
              points={shape.points?.map((point: number, i: number) =>
                i % 2 === 0 ? point : -point,
              )}
              fill={shape.fill}
              stroke={strokeOf(shape.id)}
              strokeWidth={strokeWOf(shape.id)}
              closed
              opacity={shape.opacity}
              onClick={() => handleShapeClick(shape.id)}
            />
          );
        }
        if (shape.type === 'path') {
          return (
            <Path
              key={shape.id}
              data={shape.data}
              fill={shape.fill}
              stroke={strokeOf(shape.id)}
              strokeWidth={strokeWOf(shape.id)}
              opacity={shape.opacity}
              onClick={() => handleShapeClick(shape.id)}
            />
          );
        }
        return null;
      })}

      {Array.from(contourGroups.entries()).map(([contourId, contourPoints]) => (
        <Line
          key={`contour-line-${contourId}`}
          points={contourPoints
            .sort((a, b) => {
              const aIndex = parseInt(a.id.split('-')[2], 10) || 0;
              const bIndex = parseInt(b.id.split('-')[2], 10) || 0;
              return aIndex - bIndex;
            })
            .flatMap((p) => [p.x, -p.y])}
          stroke={colors.orangeDark}
          strokeWidth={strokeWidth}
        />
      ))}

      {points.map((point) => {
        const isFocused = point.id === focusedPointId;

        return (
          <Circle
            key={point.id}
            x={point.x}
            y={-point.y}
            radius={(() => {
              if (isFocused) {
                return zoomLevel <= 4
                  ? point.radius * 0.8
                  : (point.radius / zoomLevel) * 2.5;
              }
              return zoomLevel <= 4
                ? point.radius / 2
                : point.radius / zoomLevel;
            })()}
            fill={isFocused ? colors.orange : point.fill}
            stroke={isFocused ? 'blue' : strokeOf(point.id)}
            strokeWidth={isFocused ? strokeWidth * 3 : strokeWOf(point.id)}
            onClick={() => handleShapeClick(point.id)}
          />
        );
      })}
    </>
  );
}
