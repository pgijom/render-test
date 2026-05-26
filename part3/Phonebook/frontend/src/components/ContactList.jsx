import Contact from "./Contact.jsx";

const ContactList = ({filteredPersons, removePerson}) => <>{filteredPersons.map(person => <Contact key={person.name} person={person} remove={removePerson}/>)}</>;

export default ContactList;