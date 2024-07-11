import React, {useEffect, useState} from "react";
import { Typography, Textarea } from "@material-tailwind/react";
import { answerContact } from "@/api/contactApi";

const AnswerContactPopup = ({ isOpen, onClose, contact }) => {
    const [formData, setFormData] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if(contact) {
            setFormData(contact);
        }
    }, [contact]);

    const validateAnswer = () => {
        let valid = true;
        const newErrors = {};

        if(!formData.answer) {
            newErrors.answer = "Answer is required";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleAnswer = async (e) => {
        e.preventDefault();
        if(validateAnswer()) {
            try {
                const response = await answerContact(formData);
                console.log(response.data);
                onClose();
                window.location.reload();
            } catch (err) {
                console.error(err);
                const newErrors = {};
                newErrors.answer = err.response.data;
                setErrors(newErrors);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const user = localStorage.getItem('user');
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
            adminId: user.userId,
        }));
    }

    return (
        <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? "" : "hidden"}`}>
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="w-full">
                                    <Typography variant="small" color="blue-gray" className="mt-3 font-medium">Subject: <span>{formData.subject}</span></Typography>
                                    <Typography variant="small" color="blue-gray" className="mt-3 font-medium">Question: <span>{formData.question}</span></Typography>
                                    <Typography variant="small" color="blue-gray" className="mt-3 font-medium">Answer</Typography>
                                    <Textarea type="text" name="answer" id="answer" size="lg" value={formData.answer || ''} onChange={handleChange} error={errors.answer}/>
                                    {errors.answer && 
                                        <Typography variant="small" color="red" className="mt-1">
                                            {errors.answer}
                                        </Typography>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="button" onClick={handleAnswer} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">Answer</button>
                            <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AnswerContactPopup;