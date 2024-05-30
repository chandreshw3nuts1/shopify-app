import { useEffect, useState, useCallback } from "react";
import { json } from "@remix-run/node";

const ItemRating = ({noOfRating}) => {
	return (
        <>
        {
            (() => {

                if(noOfRating == 1) {
                        return (
                            <>
                                <span className="star checked">&#9733;</span>
                                <span className="star uncheck">&#9733;</span>
                                <span className="star uncheck">&#9733;</span>
                                <span className="star uncheck">&#9733;</span>
                                <span className="star uncheck">&#9733;</span>
                            </>
                        )
                } else if (noOfRating == 2) {
                    return (
                        <>
                            <span className="star checked">&#9733;</span>
                            <span className="star checked">&#9733;</span>
                            <span className="star uncheck">&#9733;</span>
                            <span className="star uncheck">&#9733;</span>
                            <span className="star uncheck">&#9733;</span>
                        </>
                    )
                } else if (noOfRating == 3) {
                    return (
                        <>
                            <span className="star checked">&#9733;</span>
                            <span className="star checked">&#9733;</span>
                            <span className="star uncheck">&#9733;</span>
                            <span className="star uncheck">&#9733;</span>
                            <span className="star uncheck">&#9733;</span>
                        </>
                    )
                } else if (noOfRating == 4 ) {
                    return (
                        <>
                            <span className="star checked">&#9733;</span>
                            <span className="star checked">&#9733;</span>
                            <span className="star checked">&#9733;</span>
                            <span className="star checked">&#9733;</span>
                            <span className="star uncheck">&#9733;</span>
                        </>
                    )
                } else if (noOfRating == 5) {
                    return (
                        <>
                            <span className="star checked">&#9733;</span>
                            <span className="star checked">&#9733;</span>
                            <span className="star checked">&#9733;</span>
                            <span className="star checked">&#9733;</span>
                            <span className="star checked">&#9733;</span>
                        </>
                    )
                } else {
                    return (
                        <>
                        <span className="star uncheck">&#9733;</span>
                        <span className="star uncheck">&#9733;</span>
                        <span className="star uncheck">&#9733;</span>
                        <span className="star uncheck">&#9733;</span>
                        <span className="star uncheck">&#9733;</span>
                    </>
                    )
                }
            })()  
        }  
        </>
	);
  
  }
  
  export default ItemRating;
