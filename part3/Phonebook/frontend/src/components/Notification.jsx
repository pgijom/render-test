const Notification = ({message, success}) => {
    if (!message) {
        return null;
    }

    return (
        <div className={success ? "success" : "error"}>
            {message}
        </div>
    )
}

export default Notification;