import Attachment from "./svg/Attachment"

const MessageForm = ({handleSubmit, text, setText, setImg}) => { 
    return ( 
        <form className="message-form" onSubmit={handleSubmit}>
            <label htmlFor="img">
                <Attachment/>
            </label>
            <input type="file" id="img" accept="image/*" style={{display: "none"}} onChange={e=> setImg(e.target.files[0])}/>
            <div>
                <input type="text" placeholder="Enter message" value={text} onChange={e=> setText(e.target.value)}/>
            </div>
            <div>
                <button className="btn">Send</button>
            </div>
        </form>
    )
}

export default MessageForm;