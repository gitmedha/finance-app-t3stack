

interface FileUploadProps {
    handleChange: (data:object) => void;
}

const FileUploadInput: React.FC<FileUploadProps> = ({ handleChange }) => {

    return (
        <div className="rounded-md border border-gray bg-gray-50 w-full">
            <label htmlFor="upload" className="flex justify-start items-center gap-2 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="my-1.5 h-8 w-8 fill-white stroke-primary" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-gray-600 font-medium">Upload file</span>
            </label>
            <input onChange={handleChange} id="upload" type="file" className="hidden" />
        </div>

    );
};

export default FileUploadInput;
