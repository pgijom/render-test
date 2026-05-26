const AddContact = ({addPerson, handleNameChange, handleNumberChange, newName, newNumber}) => {
    return <form onSubmit={addPerson}>
        <div>
            <label htmlFor="name-input">Name:</label>
            <input id="name-input" onChange={handleNameChange} value={newName}/>
        </div>
        <div>
            <label htmlFor="number-input">Number:</label>
            <input id="number-input" onChange={handleNumberChange} value={newNumber}/>
        </div>
        <div>
            <button type="submit">Add</button>
        </div>
    </form>
};

export default AddContact;