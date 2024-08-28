import { useEffect, useRef } from 'react';

const Attribute = ({
  name,
  entityName,
  type,
  setAttributeRefs,
  setAttributeConnections,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    setAttributeRefs((prevState) => {
      const newState = { ...prevState };

      if (!newState[entityName]) {
        newState[entityName] = {};
      }

      newState[entityName] = {
        ...newState[entityName],
        [name]: ref,
      };

      return newState;
    });
  }, [entityName, name, ref, setAttributeRefs]);

  const handleDrop = (e) => {
    e.preventDefault();

    const fromEntity = e.dataTransfer.getData('entityName');
    const fromAttribute = e.dataTransfer.getData('attributeName');

    if (fromEntity === entityName) {
     return;
    }

    setAttributeConnections((prevState) => {
      return [
        ...prevState,
        {
          fromEntity,
          fromAttribute,
          toEntity: entityName,
          toAttribute: name,
        },
      ];
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };


  const handleDragStart = (e) => {
    e.dataTransfer.setData('entityName', entityName);
    e.dataTransfer.setData('attributeName', name);
    e.dataTransfer.setData('typeAttribute', type);
  };


  return (
    <div
      className="entity__attribute"
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      draggable
      ref={ref}
    >
      {name}
    </div>
  );
};

export default Attribute;
