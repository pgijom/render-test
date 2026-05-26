const Contact = ({person, remove}) => <div>{person.name}, {person.number} <button onClick={() => remove(person.id, person.name)}>Delete</button></div>;

export default Contact;