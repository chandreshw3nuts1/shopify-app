

const AlertInfo = (props) => {
    return (
        <div className={`alertbox ${props.colorTheme}`}>
            {props.iconClass &&
                <div className="iconbox">
                    <i className={`${props.iconClass}`}></i>
                </div>
            }
            <div className="plaintext flxflexi" >{props.alertContent}</div>
            {props.alertClose && 
                <div className="closebtn">
                    <a href="#">
                        <i class="twenty-closeicon"></i>
                    </a>
                </div>
            }
        </div>
    )
}

export default AlertInfo;