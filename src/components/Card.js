const Card = ({ member }) => {
  return (
    <div className="member-card">
      {member.image && (
        <img src={member.image} alt={member.name + " profile pic"}></img>
      )}
      {!member.image && (
        <img
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          alt="no image"
        />
      )}
      <div className="member-info">
        <p>{member.name}</p>
        <p>
          {member.lastUp !== ""
            ? new Date(member.lastUp).toDateString()
            : "No previous date yet"}
        </p>
      </div>
      <i className="fas fa-grip-lines"></i>
    </div>
  );
};

export default Card;
