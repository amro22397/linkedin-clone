import { mailtrapClient, sender } from "../lib/mailtrap.js"
import { createCommentNotificationEmailTemplate, createConnectionAcceptedEmailTemplate, createWelcomeEmailTemplate } from "./emailTemplates.js"


export const sendWelcomeEmail = async (email , name, profileUrl) => {
    const recipent = [{ email: email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipent,
            subject: "Welcome to Unlinked",
            html: createWelcomeEmailTemplate(name, profileUrl),
            category: "welcome"
        })

        console.log("Welcome Email sent successfully", response)
    } catch (error) {
        console.log(error)
        throw (error)
        
    }
}


export const sendCommentNotificationEmail = async (
    recipentEmail,
    recipentName,
    authorName,
    postUrl,
    commentContent
) => {

    const recepient = [{ email: recipentEmail }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recepient,
            subject: "New comment on Your Post",
            html: createCommentNotificationEmailTemplate(recipentName, authorName, postUrl, commentContent),
            category: "comment_notification",
        })

        console.log("comment Notification Email sent successfully", response)
    } catch (error) {
        throw error
    }
}

export const sendConnectionAcceptedEmail = async (senderEmail, senderName, recipientName, profileUrl) => {
	const recipient = [{ email: senderEmail }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: `${recipientName} accepted your connection request`,
			html: createConnectionAcceptedEmailTemplate(senderName, recipientName, profileUrl),
			category: "connection_accepted",
		});
	} catch (error) {}
};