import  React, { useState, useCallback, useEffect  } from 'react';
import { formatDate, formatTimeAgo } from './../../../utils/dateFormat';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';


const QuestionItemType = 'icon';
const DraggableQuestion = ({ id, index,questionItem,shopRecords, customQuestionsAnswer, deleteQuestion,editQuestion, moveInputQuestion }) => {
    const ref = React.useRef(null);

    const [{ isDragging }, drag] = useDrag({
        type: QuestionItemType,
        item: { id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ isOver }, drop] = useDrop({
        accept: ItemType,
        drop: () => handleDrop(),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveInputQuestion(draggedItem.index, index);
            draggedItem.index = index;
            }
        },
    });

    const handleDrop = async () => {
        const customParams = {
            shopRecords: shopRecords,
            questionList: customQuestionsAnswer,
            actionType : "reorderQuestion"
        };
        const response = await fetch(`/api/custom-question`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customParams)
        });

    };
    
      
    drag(drop(ref));
      
    return (
    <div  className="draggable">
        <span ref={ref} className="move-icon">☰</span>
        <br/>
        chands--- {questionItem.question}
        <br/>
        <button onClick={(e) => deleteQuestion(questionItem._id, index)}>Delete</button>
        <button onClick={(e) => editQuestion(index)}>Edit</button>

    </div>
    );
};


const ItemType = 'icon';
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
    <div  className="draggable">
        <span ref={ref} className="move-icon">☰</span>
        
        <input
        type="text"
        value={value}
        name={id}
        id={id}
        onChange={(e) => handleInputChanges(index, e)}
        />
        <br/>
        <span className="">{value.length}/24</span>
        { allowDeleteAns && (
            <button onClick={(e) => deleteAnswerInput(index, e)}>Delete</button>
        )}
    </div>
    );
};
  
export default function CustomQuestions({customQuestionsData, shopRecords}) {
    const defualtQuestionAndAns = [
        {"name" : "ans1" , "val" : ""},
        {"name" : "ans2", "val" : ""},
    ];
    const [customQuestionsAnswer, setCustomQuestionsAnswer] = useState(customQuestionsData);

    const [inputValueError, setInputValueError] = useState(false);
    const [show, setShow] = useState(false);
    const [allowDeleteAns, setAllowDeleteAns] = useState(true);
    const [questionTitle, setQuestionTitle] = useState('');
    const [customAnswer, setCustomAnswer] = useState(defualtQuestionAndAns);
    const [isAddMoreButtonVisible, setIsAddMoreButtonVisible] = useState(true);
    const [isUpdatingQuestion, setIsUpdatingQuestion] = useState(false);
    const [updatingQuestionId, setUpdatingQuestionId] = useState('');
    const [editQuestionIndex, setEditQuestionIndex] = useState('');

    const handleCloseModal = () => setShow(false);
    const handleShowModal = () => {
        setShow(true);
        setQuestionTitle('');
        setCustomAnswer(defualtQuestionAndAns);
        setIsUpdatingQuestion(false);
        setUpdatingQuestionId('');
        setIsAddMoreButtonVisible(true);
    }
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
        if (questionTitle.length > 40) {
            setInputValueError(true);
        }
        const newData = customAnswer.map(item => {
            if(item.val.trim() == ''){
                setInputValueError(true);
            }

            if (item.val.trim().length > 24) {
                setInputValueError(true);
            }
        });

    }, [questionTitle,customAnswer ]);
    

  // Function to add more input fields
    const addAnswerInput = () => {
        const totalAns = parseInt(document.getElementsByClassName('modalAnswerItems').length) +1;
        if(totalAns>=5){
            setIsAddMoreButtonVisible(false);
        }
        setAllowDeleteAns(true);
        
        setCustomAnswer([...customAnswer, { name: "ans"+totalAns, val: '' }]);
    };

    const deleteAnswerInput = (index, event) => {
        const totalAns = parseInt(document.getElementsByClassName('modalAnswerItems').length);
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
        const customParams = {
            question: questionTitle,
            answers: customAnswer,
            shopRecords : shopRecords,
            updatingQuestionId:updatingQuestionId,
            actionType : isUpdatingQuestion ? "updateQuestionAnswer" : "submitQuestionAnswer"
        };
        const response = await fetch(`/api/custom-question`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customParams)
        });
        const data = await response.json();
        if(updatingQuestionId){


            setCustomQuestionsAnswer(prevQuestionAnswers => {
                const updatedAnswers = [...prevQuestionAnswers];
                updatedAnswers[editQuestionIndex] = data.data; 
                return updatedAnswers;
            });

            console.log(customQuestionsAnswer);
            //setCustomQuestionsAnswer(customQuestionsAnswer.filter((item, i) => i !== editQuestionIndex));
            //setCustomQuestionsAnswer([...customQuestionsAnswer, data.data]);
        } else {
            setCustomQuestionsAnswer([...customQuestionsAnswer, data.data]);
        }
        setShow(false);
    };


    const moveInputQuestion = (fromIndex, toIndex) => {
        const updatedInputs = update(customQuestionsAnswer, {
            $splice: [
            [fromIndex, 1],
            [toIndex, 0, customQuestionsAnswer[fromIndex]],
            ],
        });
        setCustomQuestionsAnswer(updatedInputs);
    };
    const deleteQuestion = async (id, index) => {
        Swal.fire({
            title: 'Are you sure that you want to delete this custom question?',
            text: "This action is irreversible, and this custom question will not be accessible again.",
            // icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete'
        }).then(async (result) => { 
            if (result.isConfirmed) {
                try {
                    const customParams = {
                        id: id,
                        shopRecords : shopRecords
                    };
                    const response = await fetch(`/api/custom-question`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(customParams)
                    });
                    
                    const data = await response.json();
                    if(data.status == 200) {
                        toast.success(data.message);

                        setCustomQuestionsAnswer(customQuestionsAnswer.filter((item, i) => i !== index));
                    } else {
                        toast.error(data.message);
                    }
                    // Assuming toast is a function to show notifications
                } catch (error) {
                    console.error("Error deleting record:", error);
                    // Handle error, show toast, etc.
                    toast.error("Failed to delete record.");
                }
            }
        });

    }
    const editQuestion = (index) => {
        setShow(true);
        const editSingleQuestion = customQuestionsAnswer[index];
        setQuestionTitle(editSingleQuestion.question);
        setCustomAnswer(editSingleQuestion.answers);
        setIsAddMoreButtonVisible(true);
        const totalAns = parseInt(editSingleQuestion.answers.length);
        console.log(totalAns);
        if(totalAns>=5){
            setIsAddMoreButtonVisible(false);
        }
        setIsUpdatingQuestion(true);
        setUpdatingQuestionId(editSingleQuestion._id);
        setEditQuestionIndex(index);
    }
    return (
      <>
        {/* <CustomQuestionsLists customQuestionsData={customQuestionsDataItem} shopRecords={shopRecords}/> */}
        
        <DndProvider backend={HTML5Backend}>
            <div>
                {customQuestionsAnswer.map((input, index) => (
                    <div className='loopAns' key={index}>
                        <DraggableQuestion
                            id={input._id}
                            index={index}
                            questionItem={input}
                            customQuestionsAnswer={customQuestionsAnswer}
                            shopRecords={shopRecords}
                            deleteQuestion={deleteQuestion}
                            editQuestion={editQuestion}
                            moveInputQuestion={moveInputQuestion}
                        />
                    </div>
                ))}
            </div>
        </DndProvider>



        <Button variant="primary" onClick={handleShowModal}>
          New Question
        </Button>
  
        <Modal show={show} onHide={handleCloseModal} size="lg" backdrop="static">
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
                                    <div className='modalAnswerItems' key={index}>
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
                    <Button variant="secondary" onClick={handleCloseModal}>
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