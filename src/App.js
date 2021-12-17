import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Card from "./components/Card";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const App = () => {
  const [members, setMembers] = useState(null);
  const [nextUp, setNextUp] = useState(null);

  const fetchData = async () => {
    const results = await axios.get("/.netlify/functions/members");
    setMembers(results.data.sort((a, b) => a.order - b.order));
    if (!nextUp)
      setNextUp(results.data.filter((member) => member.nextUp === 1)[0]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSkip = async () => {
    const currId = nextUp.id;
    const currOrder = nextUp.order;
    const newOrder = nextUp.order === members.length - 1 ? 0 : nextUp.order + 1;
    const newId = members.filter((member) => member.order === newOrder)[0].id;
    console.log(members.filter((member) => member.order === newOrder)[0]);
    const dataCurr = { nextUp: 0 };
    const dataNew = { nextUp: 1, lastUp: new Date() };

    members
      .filter((member) => member.id !== newId)
      .forEach((member) => {
        axios
          .put("/.netlify/functions/update", {
            id: member.id,
            data: dataCurr,
          })
          .catch((err) => console.log("error", err));
      });

    await axios
      .put("/.netlify/functions/update", {
        id: newId,
        data: dataNew,
      })
      .catch((err) => console.log("error", err));

    const results = await axios.get("/.netlify/functions/members");
    setMembers(results.data.sort((a, b) => a.order - b.order));
    setNextUp(results.data.filter((member) => member.nextUp === 1)[0]);
    console.log(results.data);
  };

  const updateOrder = async (source, dest) => {
    const items = Array.from(members);
    const [reorderedItem] = items.splice(source, 1);
    items.splice(dest, 0, reorderedItem);
    setMembers(items);

    items.forEach((item, index) => {
      const data = { order: index };
      axios.put("/.netlify/functions/update", {
        id: item.id,
        data: data,
      });
    });
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    updateOrder(result.source.index, result.destination.index);
    fetchData();
  };

  if (!nextUp) {
    fetchData();
  }

  if (
    members &&
    members.filter(
      (member) =>
        new Date(member.lastUp).toDateString() <= new Date().toDateString()
    ).length === 0
  ) {
    handleSkip();
    fetchData();
  }

  return (
    <>
      <div className="App">
        <div className="next-up-block">
          <h1>Intangibles Next Up!</h1>
          <h2>Who's Next?</h2>
          <div className="next-up-card">
            {nextUp && (
              <img
                src={
                  nextUp.image === ""
                    ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    : nextUp.image
                }
                alt={
                  nextUp.image === ""
                    ? "no image"
                    : nextUp.name + " profile pic"
                }
              />
            )}
            <h3>{nextUp && <>{nextUp.name}</>}</h3>
          </div>
          <div
            className="button"
            onClick={() => handleSkip()}
            disabled={!nextUp}
          >
            Skip
          </div>
        </div>
        <div className="members">
          <h4>Members</h4>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="members">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                  {members &&
                    members.map((member, index) => (
                      <Draggable
                        key={member.id}
                        draggableId={member.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <Card member={member} />
                          </li>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
          <span className="subtext">Drag and Drop to Reorder</span>
        </div>
      </div>
    </>
  );
};

export default App;
