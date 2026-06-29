const EmptyState = ({
    title,
    description,
    buttonText,
    onButtonClick,
}) => {
    return (
        <div className="empty-state">
            <h3> {title} </h3>
            <p> {description} </p>
            {buttonText && (
                <button className="primary-btn"
                    onClick={onButtonClick}
                >
                    {buttonText}
                </button>
            )}
        </div>
    );
};
export default EmptyState;