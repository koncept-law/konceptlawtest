import DOMPurify from "dompurify";
import JoditEditor from "jodit-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const EmailBox = ({ html, setHtml }) => {
    const [plainText, setPlainText] = useState('');


    // const someText = `<p style="background-color:blue; color:red;">Some Text We Enter <p>`

    useEffect(() => {
        // Simulate fetching HTML content from the backend
        const fetchHtmlContent = async () => {
            // Replace with your actual fetch call
            // const response = await fetch('/path-to-your-api');
            // const htmlContent = await response.text();
            // const htmlContent = "<p>Some Text <strong>some more text </strong> please Look at the text <i>formatting</i> idiot </p>"
            const htmlContent = `${html}`

            // Sanitize the HTML content
            const sanitizedContent = DOMPurify.sanitize(htmlContent);

            // Convert HTML to plain text while keeping formatting
            const tempElement = document.createElement('div');
            tempElement.innerHTML = sanitizedContent;
            const formattedText = tempElement.innerText;

            setHtml(sanitizedContent);
            setPlainText(formattedText);
        };

        fetchHtmlContent();
    }, []);


    const emailTextRef = useRef(null)
    const config = {
        height: "500px",
        // Ensure the toolbar is configured as needed
        toolbar: true,
        // Preserve formatting on paste
        paste: {
            cleanOnPaste: false, // Prevents cleaning pasted HTML
            removeStylesOnPaste: false, // Keeps styles on paste
            removeClassesOnPaste: false, // Keeps classes on paste
        },
        // Allow all HTML tags and attributes
        allowTags: '*',
        allowAttributes: '*',
        // Configure to avoid automatic conversion of tags or styles
        // defaultMode: JoditEditor.MODE_WYSIWYG,
        enter: 'P', // Default enter action to create <p> tags
        // Additional configurations as needed
        readonly: false, // all options from https://xdsoft.net/jodit/doc/
        toolbarAdaptive: false,
        toolbarSticky: false,
        uploader: {
            insertImageAsBase64URI: false, // Do not use base64
            url: 'http://localhost:5000/upload', // Your backend upload endpoint
            filesVariableName: function (i) {
                return 'file' + (i > 0 ? '[' + i + ']' : '');
            },
            isSuccess: function (resp) {
                return !resp.error;
            },
            getMessage: function (resp) {
                return resp.msg;
            },
            process: function (resp) {
                return {
                    files: resp.files || [],
                    path: resp.path,
                    baseurl: resp.baseurl,
                    error: resp.error,
                    msg: resp.msg,
                };
            },
        },
        filebrowser: {
            ajax: {
                url: 'http://localhost:5000/browse', // Your backend browse endpoint
                headers: {
                    Authorization: 'Bearer your-token', // Optional: add headers for authorization
                },
            },
        },
        // buttons: [
        //     {
        //         name: 'print',
        //         iconURL: 'https://icons.iconarchive.com/icons/icons8/windows-8/48/Printing-Print-icon.png', // URL to an icon image for the print button
        //         exec: (editor) => {
        //             const content = editor.value;
        //             const printWindow = window.open('', '', 'height=500,width=800');
        //             printWindow.document.write('<html><head><title>Print</title></head><body>');
        //             printWindow.document.write(content);
        //             printWindow.document.write('</body></html>');
        //             printWindow.document.close();
        //             printWindow.print();
        //         }
        //     }
        // ]
    }
    return (
        <div className="">
            <JoditEditor
                rows={6}
                ref={emailTextRef}
                config={config}
                // className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
                onBlur={(newContent) => setHtml(newContent)}
                onChange={newcontent => { }}
                value={html}
            />
            {/* <div>
                {plainText}
            </div> */}
        </div>
    )
}

export default EmailBox;
