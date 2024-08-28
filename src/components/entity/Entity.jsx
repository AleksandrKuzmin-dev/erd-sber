import { useEffect, useState, useRef } from 'react';
import './Entity.css';
import Attribute from '../attribute/Attribute';

const Entity = ({
  name,
  attributes,
  boardRef,
  allowAddAtributes,
  setEntities,
  setAttributeRefs,
  setAttributeConnections,
  onMove,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ left: 0, top: 0 });

  const entityRef = useRef(null);

  const handleMouseDown = (event) => {
    setIsDragging(true);

    const rect = entityRef.current.getBoundingClientRect();

    setOffset({
      left: event.clientX - rect.left,
      top: event.clientY - rect.top,
    });
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      onMove(name, true);
      const entityRect = entityRef.current.getBoundingClientRect();
      const boardRect = boardRef.current.getBoundingClientRect();

      let posX = event.clientX - offset.left - boardRect.left;
      let posY = event.clientY - offset.top - boardRect.top;

      if (posX < 0) posX = 0;
      if (posY < 0) posY = 0;

      if (posX + entityRect.width + boardRect.left > boardRect.right) {
        posX = boardRect.right - boardRect.left - entityRect.width;
      }
      if (posY + entityRect.height + boardRect.top > boardRect.bottom) {
        posY = boardRect.bottom - boardRect.top - entityRect.height;
      }

      setPosition({
        x: posX,
        y: posY,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    onMove(name, false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const fromEntity = e.dataTransfer.getData('entityName');
    const fromAttribute = e.dataTransfer.getData('attributeName');
    const typeFromAttribute = e.dataTransfer.getData('typeAttribute');

    if (fromEntity === name) {
      return;
    }

    setEntities((prevEntities) => {
      let indexEntity = null;

      prevEntities.forEach((item, index) => {
        if (item.name === name) {
          indexEntity = index;
        }
      });

      const newEntity = {
        ...prevEntities[indexEntity],
        attributes: {
          ...prevEntities[indexEntity].attributes,
          [fromAttribute]: typeFromAttribute,
        },
      };

      const newEntities = [...prevEntities];
      newEntities[indexEntity] = newEntity;

      return newEntities;
    });

    setAttributeConnections((prevState) => {
      return [
        ...prevState,
        {
          fromEntity,
          fromAttribute,
          toEntity: name,
          toAttribute:fromAttribute,
        },
      ];
    });
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, boardRef]);

  const renderAttributes = () => {
    const attributesArr = Object.keys(attributes);
    return attributesArr.map((attribute, index) => {
      return (
        <Attribute
          name={attribute}
          key={index}
          entityName={name}
          type={attributes[attribute]}
          setAttributeRefs={setAttributeRefs}
          setAttributeConnections={setAttributeConnections}
        />
      );
    });
  };

  return (
    <div
      className="entity"
      ref={entityRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="entity__title" onMouseDown={handleMouseDown}>
        {name}
      </div>
      <div className="entity__attributes">{renderAttributes()}</div>
      {allowAddAtributes && (
        <div
          className="entity__add-attributes"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          + Добавить аттрибут
        </div>
      )}
    </div>
  );
};

export default Entity;
