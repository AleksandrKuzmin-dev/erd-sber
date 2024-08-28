import { useState, useEffect } from 'react';
import './ConnectAttributes.css';

const ConnectAttributes = ({
  connection,
  attributeRefs,
  boardRef,
  movingEntities,
}) => {
  const [refsLoaded, setRefsLoaded] = useState(false);
  const [lineCoords, setLineCoords] = useState({
    fromX: 0,
    fromY: 0,
    toX: 0,
    toY: 0,
    extraX1: null,
    extraY1: null,
    extraX2: null,
    extraY2: null,
  });

  const updateLineCoords = () => {
    if (
      !attributeRefs[connection.toEntity] ||
      !attributeRefs[connection.toEntity][connection.toAttribute]
    ) {
      return;
    }

    if (!refsLoaded) setRefsLoaded(true);

    const fromAttributeRect =
      attributeRefs[connection.fromEntity][
        connection.fromAttribute
      ].current.getBoundingClientRect();
    const toAttributeRect =
      attributeRefs[connection.toEntity][
        connection.toAttribute
      ].current.getBoundingClientRect();
    const boardRect = boardRef.current.getBoundingClientRect();

    let fromX, fromY, toX, toY;
    let extraX1 = null;
    let extraY1 = null;
    let extraX2 = null;
    let extraY2 = null;

    const isPosLeft = fromAttributeRect.right < toAttributeRect.left;
    const isPosRight = fromAttributeRect.left > toAttributeRect.right;
    const isPosTop = fromAttributeRect.top < toAttributeRect.top;
    const isPosBottom = fromAttributeRect.top > toAttributeRect.bottom;
    const isPosLeftTop = isPosLeft && isPosTop;
    const isPosLeftBottom = isPosLeft && isPosBottom;
    const isPosRightTop = isPosRight && isPosTop;
    const isPosRightBottom = isPosRight && isPosBottom;

    if (isPosLeft) {
      fromX = fromAttributeRect.right - boardRect.left;
      fromY =
        fromAttributeRect.top - boardRect.top + fromAttributeRect.height / 2;
      toX = toAttributeRect.left - boardRect.left;
      toY = toAttributeRect.top - boardRect.top + toAttributeRect.height / 2;
    }

    if (isPosRight) {
      fromX = fromAttributeRect.left - boardRect.left;
      fromY =
        fromAttributeRect.top - boardRect.top + fromAttributeRect.height / 2;
      toX = toAttributeRect.right - boardRect.left;
      toY = toAttributeRect.top - boardRect.top + toAttributeRect.height / 2;
    }

    if (isPosBottom && !isPosLeft && !isPosRight) {
      fromX =
        fromAttributeRect.left - boardRect.left + fromAttributeRect.width / 2;
      fromY = fromAttributeRect.top - boardRect.top;
      toX = toAttributeRect.left - boardRect.left + toAttributeRect.width / 2;
      toY = toAttributeRect.bottom - boardRect.top;
    }

    if (isPosTop && !isPosLeft && !isPosRight) {
      fromX =
        fromAttributeRect.left - boardRect.left + fromAttributeRect.width / 2;
      fromY = fromAttributeRect.bottom - boardRect.top;
      toX = toAttributeRect.left - boardRect.left + toAttributeRect.width / 2;
      toY = toAttributeRect.top - boardRect.top;
    }

    if (isPosLeftTop) {
      extraX1 = fromX + (toX - fromX) / 2;
      extraY1 = fromY;
      extraX2 = extraX1;
      extraY2 = toY;
    }

    if (isPosLeftBottom) {
      extraX1 = fromX + (toX - fromX) / 2;
      extraY1 = fromY;
      extraX2 = extraX1;
      extraY2 = toY;
    }

    if (isPosRightTop) {
      extraX1 = fromX + (toX - fromX) / 2;
      extraY1 = fromY;
      extraX2 = extraX1;
      extraY2 = toY;
    }

    if (isPosRightBottom) {
      extraX1 = fromX + (toX - fromX) / 2;
      extraY1 = fromY;
      extraX2 = extraX1;
      extraY2 = toY;
    }

    setLineCoords({
      fromX,
      fromY,
      toX,
      toY,
      extraX1,
      extraY1,
      extraX2,
      extraY2,
    });
  };

  useEffect(() => {
    if (
      movingEntities[connection.fromEntity] ||
      movingEntities[connection.toEntity] ||
      !refsLoaded
    ) {
      updateLineCoords();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movingEntities, attributeRefs, connection]);

  useEffect(() => {
    updateLineCoords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <svg className="conntect-attributes" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="black" />
        </marker>
      </defs>
      {lineCoords.extraX1 !== null &&
      lineCoords.extraY1 !== null &&
      lineCoords.extraX2 !== null &&
      lineCoords.extraY2 !== null ? (
        <path
          d={`M ${lineCoords.fromX} ${lineCoords.fromY} 
              L ${lineCoords.extraX1} ${lineCoords.extraY1} 
              L ${lineCoords.extraX2} ${lineCoords.extraY2} 
              L ${lineCoords.toX} ${lineCoords.toY}`}
          stroke="black"
          fill="none"
          markerEnd="url(#arrowhead)"
        />
      ) : (
        <line
          x1={lineCoords.fromX}
          y1={lineCoords.fromY}
          x2={lineCoords.toX}
          y2={lineCoords.toY}
          stroke="black"
          markerEnd="url(#arrowhead)"
        />
      )}
    </svg>
  );
};

export default ConnectAttributes;
