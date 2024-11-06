import React, { useEffect, useRef } from 'react';
import JXG from 'jsxgraph';

const CartesianPlane: React.FC = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const isConvex = false; // Defina como true para vértices convexos, false para vértices côncavos

  useEffect(() => {
    if (boardRef.current) {
      const board = JXG.JSXGraph.initBoard(boardRef.current, {
        boundingbox: [-10, 10, 10, -10],
        axis: true,
        zoom: {
          factorX: 1.2,
          factorY: 1.2,
          wheel: true,
          needShift: false,
          min: 0.1,
          max: 10,
        },
        pan: {
          enabled: true,
          needShift: false,
        },
      });

      // Adicione pontos, linhas ou outras figuras geométricas aqui
      board.create('point', [1, 1], { name: 'A', fixed: true });
      board.create('point', [2, 2], { name: 'B', fixed: true });
      board.create(
        'line',
        [
          [1, 1],
          [2, 2],
        ],
        { straightFirst: false, straightLast: false, fixed: true },
      );

      // Crie um retângulo com vértices arredondados
      const rectPoints = [
        [3, 3],
        [5, 3],
        [5, 5],
        [3, 5],
      ];
      const radius = 0.5;

      // Segmentos de linha
      board.create(
        'segment',
        [
          [rectPoints[0][0] + radius, rectPoints[0][1]],
          [rectPoints[1][0] - radius, rectPoints[1][1]],
        ],
        { fixed: true },
      );
      board.create(
        'segment',
        [
          [rectPoints[1][0], rectPoints[1][1] + radius],
          [rectPoints[2][0], rectPoints[2][1] - radius],
        ],
        { fixed: true },
      );
      board.create(
        'segment',
        [
          [rectPoints[2][0] - radius, rectPoints[2][1]],
          [rectPoints[3][0] + radius, rectPoints[3][1]],
        ],
        { fixed: true },
      );
      board.create(
        'segment',
        [
          [rectPoints[3][0], rectPoints[3][1] - radius],
          [rectPoints[0][0], rectPoints[0][1] + radius],
        ],
        { fixed: true },
      );

      // Arcos para os cantos arredondados
      if (isConvex) {
        board.create(
          'arc',
          [
            [rectPoints[0][0] + radius, rectPoints[0][1] + radius],
            [rectPoints[0][0], rectPoints[0][1] + radius],
            [rectPoints[0][0] + radius, rectPoints[0][1]],
          ],
          { fixed: true },
        );
        board.create(
          'arc',
          [
            [rectPoints[1][0] - radius, rectPoints[1][1] + radius],
            [rectPoints[1][0] - radius, rectPoints[1][1]],
            [rectPoints[1][0], rectPoints[1][1] + radius],
          ],
          { fixed: true },
        );
        board.create(
          'arc',
          [
            [rectPoints[2][0] - radius, rectPoints[2][1] - radius],
            [rectPoints[2][0], rectPoints[2][1] - radius],
            [rectPoints[2][0] - radius, rectPoints[2][1]],
          ],
          { fixed: true },
        );
        board.create(
          'arc',
          [
            [rectPoints[3][0] + radius, rectPoints[3][1] - radius],
            [rectPoints[3][0] + radius, rectPoints[3][1]],
            [rectPoints[3][0], rectPoints[3][1] - radius],
          ],
          { fixed: true },
        );
      } else {
        board.create(
          'arc',
          [
            [rectPoints[0][0], rectPoints[0][1]],
            [rectPoints[0][0] + radius, rectPoints[0][1]],
            [rectPoints[0][0], rectPoints[0][1] + radius],
          ],
          { fixed: true },
        );
        board.create(
          'arc',
          [
            [rectPoints[1][0], rectPoints[1][1]],
            [rectPoints[1][0], rectPoints[1][1] + radius],
            [rectPoints[1][0] - radius, rectPoints[1][1]],
          ],
          { fixed: true },
        );
        board.create(
          'arc',
          [
            [rectPoints[2][0], rectPoints[2][1]],
            [rectPoints[2][0] - radius, rectPoints[2][1]],
            [rectPoints[2][0], rectPoints[2][1] - radius],
          ],
          { fixed: true },
        );
        board.create(
          'arc',
          [
            [rectPoints[3][0], rectPoints[3][1]],
            [rectPoints[3][0], rectPoints[3][1] - radius],
            [rectPoints[3][0] + radius, rectPoints[3][1]],
          ],
          { fixed: true },
        );
      }

      return () => {
        JXG.JSXGraph.freeBoard(board);
      };
    }
  }, []);

  return (
    <div
      ref={boardRef}
      className="jxgbox"
      style={{ width: '500px', height: '500px' }}
    />
  );
};

export default CartesianPlane;
