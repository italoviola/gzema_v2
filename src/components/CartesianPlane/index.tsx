import React, { useEffect, useRef } from 'react';
import JXG from 'jsxgraph';

const CartesianPlane: React.FC = () => {
  const boardRef = useRef<HTMLDivElement>(null);

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
      board.create('point', [1, 1], { name: 'A' });
      board.create('point', [2, 2], { name: 'B' });
      board.create(
        'line',
        [
          [1, 1],
          [2, 2],
        ],
        { straightFirst: false, straightLast: false },
      );

      // Crie um retângulo
      const rectPoints = [
        [3, 3],
        [6, 3],
        [6, 6],
        [3, 6],
      ];
      board.create('polygon', rectPoints, {
        fillColor: 'silver',
        fillOpacity: 0.5,
      });

      // Crie um retângulo com bordas arredondadas
      const x = 8;
      const y = 3;
      const width = 3;
      const height = 2;
      const radius = 0.5;

      const roundedRectPoints = [
        [x + radius, y],
        [x + width - radius, y],
        [x + width, y + radius],
        [x + width, y + height - radius],
        [x + width - radius, y + height],
        [x + radius, y + height],
        [x, y + height - radius],
        [x, y + radius],
      ];

      const arcs = [
        board.create(
          'arc',
          [
            [x + width - radius, y + radius],
            [x + width, y],
            [x + width, y + radius],
          ],
          { strokeColor: 'lightblue', strokeWidth: 2 },
        ),
        board.create(
          'arc',
          [
            [x + width - radius, y + height - radius],
            [x + width, y + height],
            [x + width - radius, y + height],
          ],
          { strokeColor: 'lightblue', strokeWidth: 2 },
        ),
        board.create(
          'arc',
          [
            [x + radius, y + height - radius],
            [x, y + height],
            [x + radius, y + height],
          ],
          { strokeColor: 'lightblue', strokeWidth: 2 },
        ),
        board.create(
          'arc',
          [
            [x + radius, y + radius],
            [x, y],
            [x + radius, y],
          ],
          { strokeColor: 'lightblue', strokeWidth: 2 },
        ),
      ];

      board.create('polygon', roundedRectPoints, {
        fillColor: 'lightblue',
        fillOpacity: 0.5,
        borders: { visible: false },
      });

      return () => {
        JXG.JSXGraph.freeBoard(board);
      };
    }
  }, []);

  return <div ref={boardRef} style={{ width: '800px', height: '600px' }} />;
};

export default CartesianPlane;
