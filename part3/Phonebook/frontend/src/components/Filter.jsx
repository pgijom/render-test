const Filter = ({filter, handle}) => {
    return <>
        <label htmlFor="filter-input">Filter by name:</label>
        <input id="filter-input" value={filter} onChange={handle}/>
    </>
};

export default Filter;