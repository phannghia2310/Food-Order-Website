import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Typography, Chip, Button } from "@material-tailwind/react";
import { getAllContact } from "@/api/contactApi";
import AnswerContactPopup from "@/popup/contact/answerContactPopup";
import DeleteContactPopup from "@/popup/contact/deleteContactPopup";

export function Contact() {
    const [contacts, setContacts] = useState([]);
    const [isAnswerContactOpen, setIsAnswerContactOpen] = useState(false);
    const [isDeleteContactOpen, setIsDeleteContactOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

    useEffect(() => {
        getAllContact().then((res) => {
            console.log(res);
            setContacts(res.data);
        }).catch(error => {
            console.error(error);
        });
    }, []);

    const openAnswerContactPopup = (contact) => {
        setSelectedContact(contact);
        setIsAnswerContactOpen(true);
    };

    const closeAnswerContactPopup = () => {
        setIsAnswerContactOpen(false);
    };

    const openDeleteContactPopup = () => {
        setIsDeleteContactOpen(true);
    }

    const closeDeleteContactPopup = () => {
        setIsDeleteContactOpen(false);
    };

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="flex justify-between mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Manage Contact
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["Contact Id", "Customer Name", "Email", "Message", "Reply", "Posting Date", "Admin Id", ""].map((el) => (
                                    <th
                                        key={el}
                                        className="border-b border-blue-gray-50 py-3 px-5 text-left"
                                    >
                                        <Typography
                                            variant="small"
                                            className="text-[11px] font-bold uppercase text-blue-gray-400"
                                        >
                                            {el}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map(
                                (contact, key) => {
                                    const className = `py-3 px-5 ${key === contacts.length - 1
                                        ? ""
                                        : "border-b border-blue-gray-50"
                                        }`;

                                    return (
                                        <tr key={contact.contactId}>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {contact.contactId}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {contact.firstName} {contact.lastName}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {contact.email}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {contact.message}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                {contact.reply ? (
                                                    <>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {contact.reply}
                                                        </Typography>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Chip
                                                            variant="gradient"
                                                            color={"blue-gray"}
                                                            value={"not answered"}
                                                            className="py-0.5 px-2 text-[11px] font-medium w-fit"
                                                        />
                                                    </>
                                                )}
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {contact.postingDate}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {contact.adminId}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <div className="flex items-center gap-4">
                                                    {contact.reply === null ? (
                                                            <Typography
                                                                as="a"
                                                                href="#"
                                                                onClick={() => openAnswerContactPopup(contact)}
                                                                className="text-xs font-semibold text-blue-gray-600 hover:text-green-800 transition duration-300"
                                                            >
                                                                Answer
                                                            </Typography>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    <Typography
                                                        as="a"
                                                        href="#"
                                                        onClick={() => openDeleteContactPopup(contact)}
                                                        className="text-xs font-semibold text-blue-gray-600 hover:text-red-800 transition duration-300"
                                                    >
                                                        Delete
                                                    </Typography>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </CardBody>
            </Card>
            <AnswerContactPopup isOpen={isAnswerContactOpen} onClose={closeAnswerContactPopup} contact={selectedContact} />
            <DeleteContactPopup isOpen={isDeleteContactOpen} onClose={closeDeleteContactPopup} contact={selectedContact} />
        </div>
    );
};

export default Contact;