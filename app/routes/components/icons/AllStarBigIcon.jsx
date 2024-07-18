const AllStarBigIcon = (props) => {
    var dynamicColor1 = props.color;
    var dynamicColor2 = props.color;
    var dynamicColor3 = props.color;
    var dynamicColor4 = props.color;
    var dynamicColor5 = props.color;
    if(props.starRate == 1){
        dynamicColor2 = "currentColor";
        dynamicColor3 = "currentColor";
        dynamicColor4 = "currentColor";
        dynamicColor5 = "currentColor";
    } else if(props.starRate == 2){
        dynamicColor3 = "currentColor";
        dynamicColor4 = "currentColor";
        dynamicColor5 = "currentColor";
    }else if(props.starRate == 3){
        dynamicColor4 = "currentColor";
        dynamicColor5 = "currentColor";
    }else if(props.starRate == 4){
        dynamicColor5 = "currentColor";
    }
    
    return (
        <>
            <div className="stardiv">

                {props.CommonRatingComponent ? <props.CommonRatingComponent color={dynamicColor1}  /> : null}

            </div>
            <div className="stardiv">
                {props.CommonRatingComponent ? <props.CommonRatingComponent color={dynamicColor2} /> : null}

            </div>
            <div className="stardiv">
                {props.CommonRatingComponent ? <props.CommonRatingComponent color={dynamicColor3} /> : null}

            </div>
            <div className="stardiv">
                {props.CommonRatingComponent ? <props.CommonRatingComponent color={dynamicColor4} /> : null}

            </div>
            <div className="stardiv">
                {props.CommonRatingComponent ? <props.CommonRatingComponent color={dynamicColor5} /> : null}

            </div>
        </>
    )
}

export default AllStarBigIcon;