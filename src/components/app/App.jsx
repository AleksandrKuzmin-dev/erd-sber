import { useState, useEffect, useRef } from 'react';
import data from '../../assets/erd.json';
import './App.css';
import Entity from '../entity/Entity';
import ConnectAttributes from '../conntectAttributes/ConnectAttributes';

function App() {
  const [entities, setEntities] = useState([]);
  const [attributeRefs, setAttributeRefs] = useState({});
  const [attributeConnections, setAttributeConnections] = useState([]);
  const [movingEntities, setMovingEntities] = useState({});

  const boardRef = useRef(null);

  const handleMove = (entityName, isMoving) => {
    setMovingEntities((prev) => ({
      ...prev,
      [entityName]: isMoving,
    }));
  };

  const addEntity = () => {
    let nameEntity =
      prompt('Введите название сущности', '') || `entity${entities.length + 1}`;

    const newEntity = {
      id: entities.length,
      name: nameEntity,
      attributes: {},
      allowAddAtributes: true,
    };

    const checkUniqName = () => {
      entities.forEach((item) => {
        if (item.name === newEntity.name) {
          newEntity.name = newEntity.name + '(copy)';
          checkUniqName();
        }
      });
    };

    checkUniqName();

    setEntities((prevEntities) => {
      return [...prevEntities, newEntity];
    });
  };

  useEffect(() => {
    const newData = Object.keys(data).map((item, index) => {
      return {
        id: index,
        name: item,
        attributes: data[item],
        allowAddAtributes: false,
      };
    });

    setEntities(newData);
  }, []);

  const renderEntities = () => {
    return entities.map((item) => {
      return (
        <Entity
          name={item.name}
          allowAddAtributes={item.allowAddAtributes}
          attributes={item.attributes}
          key={item.id}
          boardRef={boardRef}
          setAttributeRefs={setAttributeRefs}
          setAttributeConnections={setAttributeConnections}
          onMove={handleMove}
          setEntities={setEntities}
        />
      );
    });
  };

  const renderConnections = () => {
    return attributeConnections.map((connection, index) => {
      return (
        <ConnectAttributes
          connection={connection}
          attributeRefs={attributeRefs}
          key={index}
          movingEntities={movingEntities}
          boardRef={boardRef}
        />
      );
    });
  };

  return (
    <div className="board" ref={boardRef}>
      {renderEntities()}
      {renderConnections()}
      <button className="board__add-entity" onClick={addEntity}>
        +
      </button>
    </div>
  );
}

export default App;
