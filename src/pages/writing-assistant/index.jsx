// import { useTranslations } from "next-intl";
// import ProtectedLayout from "@/components/layout/ProtectedLayout";
// import Image from "next/image";
// import { useState, useRef } from "react";
// import SearchBar from "@/components/searchbar";
// import TrainingProgress from "@/components/aiassistant/traininganimation";

// export default function WritingAssistant() {
//     const t = useTranslations("Library");
//     const tr = useTranslations("AIAssistant");
//     const [showUploadSection, setShowUploadSection] = useState(false);
//     const [uploadedFiles, setUploadedFiles] = useState([]);
//     const [uploading, setUploading] = useState(false);
//     const [progress, setProgress] = useState(0);
//     const [uploadCompleted, setUploadCompleted] = useState(false);
//     const [trainingStarted, setTrainingStarted] = useState(false); // New state for training
//     const fileInputRef = useRef(null);

//     // Handle file selection
//     const handleFileUpload = (event) => {
//         const files = Array.from(event.target.files);
//         if (files.length > 0) {
//             setUploading(true);
//             setProgress(0);
//             let fakeProgress = 0;

//             // Simulate Upload Progress
//             const interval = setInterval(() => {
//                 fakeProgress += 10;
//                 setProgress(fakeProgress);

//                 if (fakeProgress >= 100) {
//                     clearInterval(interval);
//                     setUploading(false);
//                     setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
//                     setUploadCompleted(true);
//                 }
//             }, 500);
//         }
//     };

//     // Function to remove a file
//     const removeFile = (fileIndex) => {
//         setUploadedFiles(uploadedFiles.filter((_, index) => index !== fileIndex));
//     };

//     return (
//         <ProtectedLayout>
//             <SearchBar />
//             <section className="p-6 max-md:mt-14">
//                 {/* AI Writing Assistant Section */}
//                 <div className="mb-6">
//                     <h2 className="text-xl font-semibold">{t("aiWritingAssistant")}</h2>
//                     <p className="text-gray-600 mt-2">{t("aiDescription")}</p>
//                 </div>

//                 {/* Upload Section */}
//                 <h3 className="text-lg font-medium">{t("trainAiModel")}</h3>
//                 <p className="text-gray-500 mb-4">{t("chooseFile")}</p>

//                 {!showUploadSection && !trainingStarted && (
//                     <div className="flex space-x-4">
//                         <button className="flex items-center text-teal-600 px-4 py-2 rounded-lg" style={{ backgroundColor: "#E7F4F3" }}>
//                             <Image src="/images/icons/upload.svg" alt="Upload Icon" width={20} height={20} className="mr-2" />
//                             {t("uploadFromLibrary")}
//                         </button>
//                         <button 
//                             className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-lg"
//                             onClick={() => setShowUploadSection(true)}
//                         >
//                             <Image src="/images/icons/device.svg" alt="Device Icon" width={20} height={20} className="mr-2" />
//                             {t("uploadFromDevice")}
//                         </button>
//                     </div>
//                 )}

//                 {/* File Upload Section */}
//                 {showUploadSection && !uploadCompleted && !trainingStarted && (
//                     <div className="mt-8 p-6 text-center">
//                         <h3 className="text-lg font-semibold mb-4 text-black">{tr("upload")}</h3>
                        
//                         {/* Hidden File Input */}
//                         <input 
//                             type="file" 
//                             multiple 
//                             className="hidden" 
//                             ref={fileInputRef}
//                             onChange={handleFileUpload} 
//                         />

//                         {/* Upload Box */}
//                         <div className="border-dashed border-2 border-teal-500 p-10 rounded-lg bg-[#E7F4F3] flex flex-col items-center">
//                             <Image src="/images/icons/upload.svg" alt="Upload Icon" width={50} height={50} className="mb-4" />
//                             <p className="text-gray-900 font-medium">
//                                 {tr("dragDropFiles")} 
//                                 <span 
//                                     className="text-teal-600 font-semibold cursor-pointer pl-1"
//                                     onClick={() => fileInputRef.current.click()}
//                                 >
//                                     {tr("browse")}
//                                 </span>
//                             </p>
//                             <p className="text-gray-500 text-sm mt-2">{tr("supportedFormats")}</p>
//                         </div>

//                         {/* Upload Progress Bar */}
//                         {uploading && (
//                             <div className="mt-4">
//                                 <p className="text-gray-700">{tr("uploadingFiles", { count: uploadedFiles.length })}</p>
//                                 <div className="w-full bg-gray-300 rounded-lg overflow-hidden mt-2">
//                                     <div className="bg-teal-500 h-2" style={{ width: `${progress}%` }}></div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Uploaded Files List */}
//                         {!uploading && uploadedFiles.length > 0 && (
//                             <div className="mt-4">
//                                 <p className="text-gray-700">{tr("uploadedFilesLabel")}</p>
//                                 {uploadedFiles.map((file, index) => (
//                                     <div key={index} className="flex justify-between items-center bg-white p-2 border rounded-lg mt-2">
//                                         <span className="text-gray-700">{file.name}</span>
//                                         <button className="text-red-500" onClick={() => removeFile(index)}>
//                                             <Image src="/images/icons/trash.svg" alt="Delete" width={15} height={15} />
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
                        
//                         {/* Upload Files Button */}
//                         <button
//                             className="mt-6 py-3 bg-teal-500 text-white rounded-lg text-lg font-medium hover:bg-teal-600 transition w-full"
//                             disabled={uploading}
//                             onClick={() => fileInputRef.current.click()}
//                         >
//                             {uploading ? tr("uploading") : tr("uploadFiles")}
//                         </button>
//                     </div>
//                 )}

//                 {/* Training Animation (Replaces Upload Section) */}
//                 {trainingStarted ? (
//                     <TrainingProgress />
//                 ) : (
//                     uploadCompleted && (
//                         <div className="mt-8 p-6 text-center ">
//                             <h3 className="text-lg font-semibold mb-4 text-black">{tr("uploadSuccess")}</h3>
//                             <p className="text-gray-500">{tr("uploadedCount", { count: uploadedFiles.length })}</p>
                            
//                             {/* List Uploaded Files */}
//                             <div className="mt-4">
//                                 {uploadedFiles.map((file, index) => (
//                                     <div key={index} className="flex justify-between items-center bg-white p-2 border rounded-lg mt-2">
//                                         <span className="text-gray-700">{file.name}</span>
//                                         <button className="text-red-500" onClick={() => removeFile(index)}>
//                                             <Image src="/images/icons/trash.svg" alt="Delete" width={15} height={15} />
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>

//                             {/* Train Model Button */}
//                             <button 
//                                 className="mt-6 px-8 py-3 bg-teal-600 text-white rounded-lg text-lg font-medium hover:bg-teal-700 transition w-full"
//                                 onClick={() => setTrainingStarted(true)} // Start Training
//                             >
//                                 {tr("trainModel")}
//                             </button>
//                         </div>
//                     )
//                 )}
//             </section>
//         </ProtectedLayout>
//     );
// }

// export async function getStaticProps(context) {
//     return {
//         props: {
//             messages: (await import(`../../../public/locales/${context.locale}.json`)).default
//         }
//     };
// }



import { useTranslations } from "next-intl";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import Image from "next/image";
import { useState, useRef } from "react";
import SearchBar from "@/components/searchbar";
import API from "@/utils/api-client";

export default function WritingAssistant() {
    const t = useTranslations("Library");
    const tr = useTranslations("AIAssistant");
    const [showUploadSection, setShowUploadSection] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userPrompt, setUserPrompt] = useState("");
    const [generatedText, setGeneratedText] = useState("");
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);

    // Handle file selection
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            // Limit to maximum 3 files
            const limitedFiles = files.slice(0, 3);
            setUploadedFiles((prevFiles) => [...prevFiles, ...limitedFiles]);
        }
    };

    // Function to remove a file
    const removeFile = (fileIndex) => {
        setUploadedFiles(uploadedFiles.filter((_, index) => index !== fileIndex));
    };

    // Function to handle text generation
    const handleGenerate = async () => {
        if (uploadedFiles.length === 0) {
            setError("Veuillez télécharger au moins un fichier.");
            return;
        }

        if (!userPrompt.trim()) {
            setError("Veuillez entrer un texte de départ.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const formData = new FormData();
            // Append files
            uploadedFiles.forEach(file => {
                formData.append('files', file);
            });
            
            // Append query text
            formData.append('query', userPrompt);

            const response = await API.post('/writing-assistant', formData);
            const data = response.data;
            setGeneratedText(data.assistedText);
        } catch (err) {
            setError(err.message || "Une erreur s'est produite");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedLayout>
            <SearchBar />
            <section className="p-6 max-md:mt-14">
                {/* AI Writing Assistant Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold">{t("aiWritingAssistant")}</h2>
                    <p className="text-gray-600 mt-2">{t("aiDescription")}</p>
                </div>

                {/* Upload Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-medium">{tr("uploadDocuments")}</h3>
                    <p className="text-gray-500 mb-4">
                        {tr("uploadHint", { max: 3 })}
                    </p>

                    {/* Upload Buttons */}
                    <div className="flex space-x-4 mb-4">
                        {/* <button className="flex items-center text-teal-600 px-4 py-2 rounded-lg" style={{ backgroundColor: "#E7F4F3" }}>
                            <Image src="/images/icons/upload.svg" alt="Upload Icon" width={20} height={20} className="mr-2" />
                            {t("uploadFromLibrary")}
                        </button> */}
                        <button 
                            className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-lg"
                            onClick={() => setShowUploadSection(true)}
                        >
                            <Image src="/images/icons/device.svg" alt="Device Icon" width={20} height={20} className="mr-2" />
                            {t("uploadFromDevice")}
                        </button>
                    </div>

                    {/* Hidden File Input */}
                    <input 
                        type="file" 
                        multiple 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleFileChange} 
                    />

                    {/* File Upload Box */}
                    {showUploadSection && (
                        <div className="border-dashed border-2 border-teal-500 p-10 rounded-lg bg-[#E7F4F3] flex flex-col items-center mb-4">
                            <Image src="/images/icons/upload.svg" alt="Upload Icon" width={50} height={50} className="mb-4" />
                            <p className="text-gray-900 font-medium">
                                {tr("dragDropFiles")} 
                                <span 
                                    className="text-teal-600 font-semibold cursor-pointer pl-1"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    {tr("browse")}
                                </span>
                            </p>
                            <p className="text-gray-500 text-sm mt-2">{tr("supportedFormats")}</p>
                        </div>
                    )}

                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                        <div className="mt-4 mb-6">
                            <p className="text-gray-700 mb-2">{tr("uploadedFilesLabel")} ({uploadedFiles.length}/3)</p>
                            {uploadedFiles.map((file, index) => (
                                <div key={index} className="flex justify-between items-center bg-white p-2 border rounded-lg mt-2">
                                    <span className="text-gray-700">{file.name}</span>
                                    <button className="text-red-500" onClick={() => removeFile(index)}>
                                        <Image src="/images/icons/trash.svg" alt="Delete" width={15} height={15} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Text Input Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">{tr("startYourText")}</h3>
                    <textarea 
                        className="w-full p-4 border border-gray-300 rounded-lg h-40 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        placeholder={tr("enterTextPrompt")}
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                    ></textarea>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Generate Button */}
                <button 
                    className="w-full py-3 bg-teal-600 text-white rounded-lg text-lg font-medium hover:bg-teal-700 transition"
                    onClick={handleGenerate}
                    disabled={isLoading}
                >
                    {isLoading ? tr("generating") : tr("generateText")}
                </button>

                {/* Generated Text Result */}
                {generatedText && (
                    <div className="mt-8">
                        <h3 className="text-lg font-medium mb-4">{tr("generatedText")}</h3>
                        <div className="p-4 border border-gray-300 rounded-lg bg-white">
                            <p className="whitespace-pre-wrap">{generatedText}</p>
                        </div>
                    </div>
                )}
            </section>
        </ProtectedLayout>
    );
}

export async function getStaticProps(context) {
    return {
        props: {
            messages: (await import(`../../../public/locales/${context.locale}.json`)).default
        }
    };
}