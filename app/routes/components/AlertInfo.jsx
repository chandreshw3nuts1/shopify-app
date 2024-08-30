

const AlertInfo = (props) => {
    return (
        <div className={`alertbox ${props.colorTheme}`}>
            {props.iconClass &&
                <div className="iconbox">
                    <i className={`${props.iconClass}`}></i>
                </div>
            }
            {props.conlink &&
                <div className="plaintext flxflexi">
                    <a href={props.conlink}>{props.alertContent}</a>
                </div>
            }
            {/* {props.alertContent &&
                <div className="plaintext flxflexi">{props.alertContent}</div>
            } */}
            {props.alertContent &&
                <div className="plaintext flxflexi" dangerouslySetInnerHTML={{ __html: props.alertContent }}></div>
            }
            {props.alertClose &&
                <div className="closebtn">
                    <a href="#">
                        <i className="twenty-closeicon"></i>
                    </a>
                </div>
            }
        </div>
    )
}

export default AlertInfo;