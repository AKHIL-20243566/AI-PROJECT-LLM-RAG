import Loader from "./Loader";

function Message({ role, text }) {

  const isUser = role === "user";
  const isLoading = text === "Loading...";

  const roleClass = isUser ? "message-user" : "message-ai";

  const copyText = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={roleClass}>

      <div className="message-bubble">

        {isLoading ? (
          <Loader />
        ) : (
          <>
            <span>{text}</span>

            {!isUser && (
              <button
                className="copy-btn"
                onClick={copyText}
              >
                Copy
              </button>
            )}
          </>
        )}

      </div>

    </div>
  );
}

export default Message;