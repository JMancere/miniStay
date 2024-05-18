import './ConfirmModal.css';

import React from "react";
import { useModal } from "../../context/Modal";

function ConfirmModal({detail}) {
  //const dispatch = useDispatch();

  //const [errors, setErrors] = useState("");

  const { closeModal } = useModal();

  //const formRef = useRef(null)

  const {heading, text, yesText, noText, yesAction, noAction} = detail;

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // setErrors("");

  //   // return dispatch(sessionActions.login({ credential, password }))
  //   //   .then(closeModal)
  //   //   .catch(async (res) => {
  //   //     console.log(res)
  //   //     const data = await res.json();
  //   //     console.log(data.message)

  //   //     if (data && data.message) {
  //   //       setErrors(data.message);
  //   //     }
  //   //   });
  // };

  const yesClick = async () => {
    if (yesAction) await yesAction();
    closeModal()
  }

  const noClick = () => {
    if (noAction) noAction();
    closeModal()
  }

  return (
    <>
      <div className="loginWrapper ">
        <h1>{heading}</h1>
        <p>{text}</p>
        <button onClick={yesClick}>{yesText}</button>
        <button onClick={noClick}>{noText}</button>
      </div>
    </>
  );
}


export default ConfirmModal;
