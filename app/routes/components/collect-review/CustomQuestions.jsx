import  React, { useState, useCallback, useEffect  } from 'react';
import { formatDate, formatTimeAgo } from './../../../utils/dateFormat';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import settings from './../../../utils/settings.json'; 
import { Modal, Button } from 'react-bootstrap';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';


const ItemType = 'INPUT';
const DraggableInput = ({ id, index, value, moveInput, handleInputChanges, allowDeleteAns, deleteAnswerInput }) => {
    const ref = React.useRef(null);

    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: ItemType,
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
            moveInput(draggedItem.index, index);
            draggedItem.index = index;
            }
        },
    });

    drag(drop(ref));

    return (
    <div ref={ref} className="draggable">
        <span className="move-icon">☰</span>
        
        <input
        type="text"
        value={value}
        name={id}
        id={id}
        onChange={(e) => handleInputChanges(index, e)}
        />
        { allowDeleteAns && (
            <button onClick={(e) => deleteAnswerInput(index, e)}>Delete</button>
        )}
    </div>
    );
};
  
export default function CustomQuestions() {

    const defualtQuestionAndAns = [
        {"name" : "ans1" , "val" : "ans val 1"},
        {"name" : "ans2", "val" : "ans val 2"},
    ];
    
    const [inputValueError, setInputValueError] = useState(false);
    const [show, setShow] = useState(false);
    const [allowDeleteAns, setAllowDeleteAns] = useState(true);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    

    const [questionTitle, setQuestionTitle] = useState('');
    const [customAnswer, setCustomAnswer] = useState(defualtQuestionAndAns);

    const [isAddMoreButtonVisible, setIsAddMoreButtonVisible] = useState(true);

    const handleInputChange = useCallback((event) => {
        if (event && event.target) {
            setQuestionTitle(event.target.value);
        } else {
          console.error('Event or event.target is undefined');
        }
    }, []);

    useEffect(() => {
        setInputValueError(false);
        if(questionTitle.trim() == ""){
            setInputValueError(true);
           
        }
        console.log(questionTitle.length);
        if (questionTitle.length > 40) {
            setInputValueError(true);
        }
        const newData = customAnswer.map(item => {
            if(item.val.trim() == ''){
                setInputValueError(true);
            }

            if (item.val.trim().length > 40) {
                setInputValueError(true);
            }
        });

    }, [questionTitle,customAnswer ]);
    


  // Function to add more input fields
    const addAnswerInput = () => {
        const totalAns = parseInt(document.getElementsByClassName('loopAns').length) +1;
        if(totalAns>=5){
            setIsAddMoreButtonVisible(false);
        }
        setAllowDeleteAns(true);
        
        setCustomAnswer([...customAnswer, { name: "ans"+totalAns, val: '' }]);
    };

    const deleteAnswerInput = (index, event) => {
        const totalAns = parseInt(document.getElementsByClassName('loopAns').length);
        if(totalAns<=5){
            setIsAddMoreButtonVisible(true);
        }

        if(totalAns<=3){
            setAllowDeleteAns(false);
        }
        setCustomAnswer(customAnswer.filter((item, i) => i !== index));

    };
    
  // Function to handle input changes
    const handleInputChanges = (index, event) => {
        const { value } = event.target;
        const allInputs = [...customAnswer];
        allInputs[index].val = value;
        setCustomAnswer(allInputs);
    };


    const moveInput = (fromIndex, toIndex) => {
        const updatedInputs = update(customAnswer, {
          $splice: [
            [fromIndex, 1],
            [toIndex, 0, customAnswer[fromIndex]],
          ],
        });
        setCustomAnswer(updatedInputs);
    };

    const submitAnswers = async () => {
        const shop = 'chandstest.myshopify.com';
        const customParams = {
            question: questionTitle,
            answers: customAnswer,
            // Add more parameters as needed
        };
        const response = await fetch(`/api/custom-question`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customParams)
        });
		
       	const data = await response.json();
        console.log(data);

    };

    return (
      <>

         


        <Button variant="primary" onClick={handleShow}>
          Open Modal
        </Button>
  
        <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
                
                <Modal.Body>
                    <span className="">Question text</span>
                    <input className="form-control"
                    type="text" // Or any other input type
                    value={questionTitle}
                    onChange={handleInputChange} />
                    <span className="">{questionTitle.length}/40</span>

                    <DndProvider backend={HTML5Backend}>
                            <div>
                            <span className="">Answers</span>

                                {customAnswer.map((input, index) => (
                                    <div className='loopAns' key={index}>
                                        <DraggableInput
                                            key={index}
                                            id={input.name}
                                            index={index}
                                            value={input.val}
                                            moveInput={moveInput}
                                            handleInputChanges={handleInputChanges}
                                            allowDeleteAns={allowDeleteAns}
                                            deleteAnswerInput={deleteAnswerInput}
                                        />
                                    </div>
                                ))}
                            </div>
                            {isAddMoreButtonVisible && (
                                <button onClick={addAnswerInput}>Add More</button>
                            )}
                    </DndProvider>
                    <hr/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                    Close
                    </Button>
                    <Button variant="primary" onClick={submitAnswers} disabled={inputValueError}>
                    Save Changes
                    </Button>
                </Modal.Footer>     
        </Modal>
      </>
    );
}