const Loading = () => {
    return (
        <div style={{postion: "relative"}}>
            <h3 
                style={{position: "fixed",
                        top: "50%",
                        left: "50%", 
                        transform: "translate(-50%, -50%)"}
                        }
            >Loading...
            </h3>
        </div>
    );
}

export default Loading;