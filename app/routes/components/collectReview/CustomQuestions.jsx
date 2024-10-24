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
    Box,
    Popover,
    ActionList, 
    Icon,
    MediaCard, 
	Text, 
	Card, 
	InlineGrid, 
	BlockStack, 
	Divider, 
	Banner, 
	Link, 
	Tooltip,
	Grid,
    InlineStack, 
    Badge,
    TextField,
    Checkbox
} from '@shopify/polaris';
import { PlusIcon, MenuVerticalIcon, DragHandleIcon, XIcon } from '@shopify/polaris-icons';
  
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
        setPopoverActive(false);
        if (optionType == 'edit') {
            editQuestion(index);
        } else if (optionType == 'delete') {
            deleteQuestion(questionId, index);
        }
    };


    const [popoverActive, setPopoverActive] = useState(false);

	const togglePopoverActive = useCallback(
		() => setPopoverActive((popoverActive) => !popoverActive),
		[],
	);
    const questionAction = (
		<Button onClick={togglePopoverActive} icon={MenuVerticalIcon}>
		</Button>
	);

    drag(drop(ref));

    return (
        <Card>
            <InlineStack wrap={false} gap='400'>
                <Box>
                    <div ref={ref} className='draggableicon flxfix flxrow'>
                        <Icon source={DragHandleIcon} tone="base" />
                    </div>
                </Box>
                <Box width='100%'>
                    <BlockStack gap='200'>
                        <Text as='h3' variant='headingMd'>{questionItem.question}</Text>
                        <InlineStack gap='400'>
                            {questionItem.answers.map((ansItem, ansIndex) => (
                                <>
                                    <Badge key={ansIndex}>{ansItem.val}</Badge>
                                    {/* <div key={ansIndex} className='singlequestion'>{ansItem.val}</div> */}
                                </>
                            ))}
                        </InlineStack>
                    </BlockStack>
                </Box>
                <Box>
                    <Popover
                        active={popoverActive}
                        activator={questionAction}
                        autofocusTarget="first-node"
                        onClose={togglePopoverActive}
                        fullWidth={false}
                        preferredAlignment='right'
                    >
                        <ActionList
                            actionRole="menuitem"
                            items={[{content: 'Edit',onAction:() => handleQuestionChange('edit', questionItem._id, index)}, {content: 'Delete', onAction:() => handleQuestionChange('delete', questionItem._id, index)}]}
                        />
                    </Popover>
                </Box>
            </InlineStack>
            
            {/* <div className='questionmiddbox flxflexi'>
                <div className='mainquestion'>
                    <h3>{questionItem.question}</h3>
                </div>
                <div className='morequestions_wrap flxrow flxwrap'>
                    {questionItem.answers.map((ansItem, ansIndex) => (
                        <div key={ansIndex} className='singlequestion'>{ansItem.val}</div>
                    ))}
                </div>
            </div> */}
            
        </Card>
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
    const handleInputChange = useCallback((value) => {
        setQuestionTitle(value);
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
    const handleInputChanges = (index, value) => {
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
            
            <BlockStack gap='400'>
                <DndProvider backend={HTML5Backend}>
                    <BlockStack gap='200'>
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
                    </BlockStack>
                </DndProvider>
                <Box>
                    <Button variant="primary" icon={PlusIcon} onClick={handleShowModal}>
                        New Question
                    </Button>
                </Box>
            </BlockStack>
            
            <Modal onHide={handleCloseModal} id="select-product-modal">
                <TitleBar title="Custom Questions">
                    <button variant="primary" onClick={submitAnswers} disabled={inputValueError}>
                        Save
                    </button>
                    <button onClick={() => shopify.modal.hide('select-product-modal')}>Close</button>
                </TitleBar>
                <Box padding="500">
                    <BlockStack gap='400'>
                        <BlockStack gap={100}>
                            <Text as='h3' variant='headingSm'>Question text</Text>
                            <TextField
                                value={questionTitle}
                                onChange={handleInputChange}
                                maxLength={40}
                                showCharacterCount
                            />
                        </BlockStack>
                        {/* <Divider /> */}
                        <BlockStack gap={100}>
                            <Text as='h3' variant='headingSm'>Answers</Text>
                            <BlockStack gap={200}>
                                {customAnswer.map((input, index) => (
                                    <InlineStack gap={400} wrap={false} key={index}>
                                        <Box width='100%'>
                                            <TextField
                                                value={input.val}
                                                name={input.name}
                                                id={input.name}
                                                onChange={(e) => handleInputChanges(index, e)}
                                                labelHidden={true}
                                                maxLength={24}
                                                showCharacterCount
                                            />
                                        </Box>
                                        {allowDeleteAns && (
                                            <Box>
                                                <Button tone='critical' onClick={(e) => deleteAnswerInput(index, e)} icon={XIcon} />
                                            </Box>
                                        )}
                                        
                                    </InlineStack>
                                ))}
                            </BlockStack>
                        </BlockStack>
                        {isAddMoreButtonVisible && (
                            <Box>
                                <Button variant="primary" icon={PlusIcon} onClick={addAnswerInput}>
                                    Add answer
                                </Button>
                            </Box>
                        )}
                        <Divider />
                        <BlockStack gap={0}>
                            <Box>
                                <Checkbox
                                    label="Make it required question"
                                    checked={isMakeRequireQuestion}
                                    onChange={handleMakeRequireQuestion}
                                    name="isMakeRequireQuestion"
                                    id="isMakeRequireQuestion"
                                />
                            </Box>
                            <Box>
                                <Checkbox
                                    label="Hide answers, won't be displayed publicly"
                                    checked={isHideAnswers}
                                    onChange={handleHideAnswers}
                                    name="isHideAnswers"
                                    id="isHideAnswers"
                                />
                            </Box>
                        </BlockStack>
                    </BlockStack>
                    
                </Box>
            </Modal>
        </>
    );
}