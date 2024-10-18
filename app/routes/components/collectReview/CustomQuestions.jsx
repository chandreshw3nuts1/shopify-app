import React, { useState, useCallback, useEffect } from 'react';
import { formatDate, formatTimeAgo } from './../../../utils/dateFormat';
import Swal from 'sweetalert2';
import {  Dropdown, DropdownButton } from 'react-bootstrap';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import MoreIcon from '../../../images/MoreIcon';
import settingsJson from './../../../utils/settings.json';
import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import {
    Button,
    Box
} from '@shopify/polaris';
import { PlusIcon } from '@shopify/polaris-icons';

const QuestionItemType = 'icon';
const DraggableQuestion = ({ id, index, questionItem, shopRecords, customQuestionsAnswer, deleteQuestion, editQuestion, moveInputQuestion }) => {
    const ref = React.useRef(null);

    const [{ isDragging }, drag] = useDrag({
        type: QuestionItemType,
        item: { id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ isOver }, drop] = useDrop({
        accept: QuestionItemType,
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
            shop_domain: shopRecords.shop,
            questionList: customQuestionsAnswer,
            actionType: "reorderQuestion"
        };
        const response = await fetch(`/api/custom-question`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customParams)
        });

        const data = await response.json();
        if (data.status == 200) {
            shopify.toast.show(data.message, {
                duration: settingsJson.toasterCloseTime
            });
        } else {
            shopify.toast.show(data.message, {
                duration: settingsJson.toasterCloseTime,
                isError: true
            });
        }

    };

    const handleQuestionChange = async (optionType, questionId, index) => {
        if (optionType == 'edit') {
            editQuestion(index);
        } else if (optionType == 'delete') {
            deleteQuestion(questionId, index);
        }
    };
    drag(drop(ref));

    return (

        <div className='questionrow'>
            <div ref={ref} className='draggableicon flxfix flxrow'>
                <div className='iconbox'>
                    <i className='twenty-dragicon'></i>
                </div>
            </div>
            <div className='questionmiddbox flxflexi'>
                <div className='mainquestion'>
                    <h3>{questionItem.question}</h3>
                </div>
                <div className='morequestions_wrap flxrow flxwrap'>
                    {questionItem.answers.map((ansItem, ansIndex) => (
                        <div key={ansIndex} className='singlequestion'>{ansItem.val}</div>
                    ))}
                </div>
            </div>
            <div className='questionaction flxfix dropdownwrap ddlightbtn'>

                <DropdownButton id="dropdown-basic-button" onSelect={(e) => handleQuestionChange(e, questionItem._id, index)} title={<MoreIcon />} align={'end'}>
                    <Dropdown.Item eventKey="edit" className="custom-dropdown-item" >Edit</Dropdown.Item>
                    <Dropdown.Item eventKey="delete" className="custom-dropdown-item" >Delete</Dropdown.Item>
                </DropdownButton>
            </div>
        </div>



    );
};

export default function CustomQuestions({ customQuestionsData, shopRecords }) {
    const shopify = useAppBridge();

    const defualtQuestionAndAns = [
        { "name": "ans1", "val": "" },
        { "name": "ans2", "val": "" },
    ];
    const [customQuestionsAnswer, setCustomQuestionsAnswer] = useState(customQuestionsData);

    const [inputValueError, setInputValueError] = useState(false);
    const [show, setShow] = useState(false);
    const [allowDeleteAns, setAllowDeleteAns] = useState(false);
    const [questionTitle, setQuestionTitle] = useState('');
    const [customAnswer, setCustomAnswer] = useState(defualtQuestionAndAns);
    const [isAddMoreButtonVisible, setIsAddMoreButtonVisible] = useState(true);
    const [isUpdatingQuestion, setIsUpdatingQuestion] = useState(false);
    const [updatingQuestionId, setUpdatingQuestionId] = useState('');
    const [editQuestionIndex, setEditQuestionIndex] = useState('');
    const [isMakeRequireQuestion, setIsMakeRequireQuestion] = useState(false);
    const handleMakeRequireQuestion = () => setIsMakeRequireQuestion(!isMakeRequireQuestion);;
    const [isHideAnswers, setIsHideAnswers] = useState(false);
    const handleHideAnswers = () => setIsHideAnswers(!isHideAnswers);;
    const [countsAnswers, setCountsAnswers] = useState(2);


    const handleCloseModal = () => {
        shopify.modal.hide('select-product-modal');
    }
    const handleShowModal = () => {
        shopify.modal.show('select-product-modal');
        setQuestionTitle('');
        setCustomAnswer(defualtQuestionAndAns);
        setIsUpdatingQuestion(false);
        setUpdatingQuestionId('');
        setIsAddMoreButtonVisible(true);
        setAllowDeleteAns(false);
        setIsMakeRequireQuestion(false);
        setIsHideAnswers(false);
        setCountsAnswers(2);

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
        if (questionTitle.trim() == "") {
            setInputValueError(true);

        }
        if (questionTitle.length > 40) {
            setInputValueError(true);
        }
        const newData = customAnswer.map(item => {
            if (item.val.trim() == '') {
                setInputValueError(true);
            }

            if (item.val.trim().length > 24) {
                setInputValueError(true);
            }
        });

    }, [questionTitle, customAnswer]);


    // Function to add more input fields
    const addAnswerInput = () => {

        const totalAns = countsAnswers + 1;
        if (totalAns >= 5) {
            setIsAddMoreButtonVisible(false);
        }
        setAllowDeleteAns(true);

        setCustomAnswer([...customAnswer, { name: "ans" + totalAns, val: '' }]);
        setCountsAnswers(totalAns);
    };

    const deleteAnswerInput = (index, event) => {
        const totalAns = countsAnswers;
        
        if (totalAns <= 5) {
            setIsAddMoreButtonVisible(true);
        }

        if (totalAns <= 3) {
            setAllowDeleteAns(false);
        }
        setCustomAnswer(customAnswer.filter((item, i) => i !== index));
        setCountsAnswers(totalAns - 1);

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
            shop_domain: shopRecords.shop,
            updatingQuestionId: updatingQuestionId,
            isHideAnswers: isHideAnswers,
            isMakeRequireQuestion: isMakeRequireQuestion,
            actionType: isUpdatingQuestion ? "updateQuestionAnswer" : "submitQuestionAnswer"
        };
        const response = await fetch(`/api/custom-question`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customParams)
        });
        const data = await response.json();
        if (data.status == 200) {
            shopify.toast.show(data.message, {
                duration: settingsJson.toasterCloseTime
            });
            if (updatingQuestionId) {
                setCustomQuestionsAnswer(prevQuestionAnswers => {
                    const updatedAnswers = [...prevQuestionAnswers];
                    updatedAnswers[editQuestionIndex] = data.data;
                    return updatedAnswers;
                });
            } else {
                setCustomQuestionsAnswer([...customQuestionsAnswer, data.data]);
            }
            setInputValueError(true);

        } else {
            shopify.toast.show(data.message, {
                duration: settingsJson.toasterCloseTime,
                isError: true
            });
        }
        shopify.modal.hide('select-product-modal');

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
                        id: id
                    };
                    const response = await fetch(`/api/custom-question`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(customParams)
                    });

                    const data = await response.json();
                    if (data.status == 200) {
                        shopify.toast.show(data.message, {
                            duration: settingsJson.toasterCloseTime
                        });
                        setCustomQuestionsAnswer(customQuestionsAnswer.filter((item, i) => i !== index));
                    } else {
                        shopify.toast.show(data.message, {
                            duration: settingsJson.toasterCloseTime,
                            isError: true
                        });
                    }
                    // Assuming toast is a function to show notifications
                } catch (error) {
                    console.error("Error deleting record:", error);
                    // Handle error, show toast, etc.
                    shopify.toast.show("Failed to delete record", {
                        duration: settingsJson.toasterCloseTime,
                        isError: true
                    });
                }
            }
        });

    }

    const editQuestion = (index) => {
        shopify.modal.show('select-product-modal');
        const editSingleQuestion = customQuestionsAnswer[index];
        setQuestionTitle(editSingleQuestion.question);
        setCustomAnswer(editSingleQuestion.answers);
        setIsAddMoreButtonVisible(true);
        const totalAns = parseInt(editSingleQuestion.answers.length);
        setCountsAnswers(totalAns);
        if (totalAns >= 5) {
            setIsAddMoreButtonVisible(false);
        }

        if (totalAns >= 3) {
            setAllowDeleteAns(true);
        }
        setIsUpdatingQuestion(true);
        setUpdatingQuestionId(editSingleQuestion._id);
        setEditQuestionIndex(index);

        setIsMakeRequireQuestion(editSingleQuestion.isMakeRequireQuestion);
        setIsHideAnswers(editSingleQuestion.isHideAnswers);
        setInputValueError(false);

    }


    return (
        <>
            {/* <CustomQuestionsLists customQuestionsData={customQuestionsDataItem} shopRecords={shopRecords}/> */}

            <DndProvider backend={HTML5Backend}>
                {customQuestionsAnswer.map((input, index) => (
                    <DraggableQuestion
                        key={input._id}
                        id={input._id}
                        index={index}
                        questionItem={input}
                        customQuestionsAnswer={customQuestionsAnswer}
                        shopRecords={shopRecords}
                        deleteQuestion={deleteQuestion}
                        editQuestion={editQuestion}
                        moveInputQuestion={moveInputQuestion}
                    />
                ))}
            </DndProvider>


            <div className='btnwrap'>
                <Button variant="primary" icon={PlusIcon} onClick={handleShowModal}>
                    New Question
                </Button>
            </div>

            <Modal onHide={handleCloseModal} id="select-product-modal">
                <TitleBar title="Custom Questions">
                    <button variant="primary" onClick={submitAnswers} disabled={inputValueError}>
                        Save
                    </button>
                    <button onClick={() => shopify.modal.hide('select-product-modal')}>Close</button>
                </TitleBar>
                <Box padding="500">
                    <div className='form-group'>
                        <label className="">Question text</label>
                        <input className="form-control"
                            type="text" // Or any other input type
                            value={questionTitle}
                            onChange={handleInputChange} />
                        <span className="letterlimite">{questionTitle.length}/40</span>
                    </div>

                    <div className='form-group'>
                        <label className="">Answers</label>

                        {customAnswer.map((input, index) => (
                            <div className='modalAnswerItems' key={index}>
                                <div className='draggable'>
                                    <div className='inputandlatter flxflexi'>
                                        <input
                                            type="text"
                                            value={input.val}
                                            name={input.name}
                                            id={input.name}
                                            className='form-control'
                                            onChange={(e) => handleInputChanges(index, e)}
                                        />
                                        <div className="letterlimite">{input.val.length}/24</div>
                                    </div>
                                    {allowDeleteAns && (
                                        <div className='deletebtn flxfix'>
                                            <button onClick={(e) => deleteAnswerInput(index, e)}>
                                                <i className='twenty-closeicon'></i>
                                            </button>
                                        </div>
                                    )}

                                </div>

                            </div>
                        ))}
                    </div>
                    {isAddMoreButtonVisible && (
                        <div className='btnwrap popbtnwrap'>
                            <button onClick={addAnswerInput} className='revbtn bluelightbtn'><i className='twenty-addicon'></i> Add Option</button>
                        </div>
                    )}
                    <div className="bottomcheckrow">
                        <div className="form-check form-switch">
                            <input
                                checked={
                                    isMakeRequireQuestion
                                }
                                onChange={
                                    handleMakeRequireQuestion
                                }
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                name="isMakeRequireQuestion"
                                id="isMakeRequireQuestion"
                            />
                            <label
                                className="form-check-label"
                                for="isMakeRequireQuestion"
                            >
                                Make it required question
                            </label>
                        </div>
                    </div>

                    <div className="bottomcheckrow">
                        <div className="form-check form-switch">
                            <input
                                checked={
                                    isHideAnswers
                                }
                                onChange={
                                    handleHideAnswers
                                }
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                name="isHideAnswers"
                                id="isHideAnswers"
                            />
                            <label
                                className="form-check-label"
                                for="isHideAnswers"
                            >
                                Hide answers, won't be displayed publicly
                            </label>
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    );
}