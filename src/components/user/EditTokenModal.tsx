import React, {useState} from "react";
import {IUser} from "@/types/user";
import api from "@/utils/axios";
import Modal from "@/components/common/Modal";
import {useAlert} from "@/context/Alert";
import Button from "@/components/common/Button";

interface EditTokenModalProps {
    user: IUser;
    onClose: () => void;
    onSuccess: () => void;
}

const EditTokenModal: React.FC<EditTokenModalProps> = ({user, onClose, onSuccess}) => {
    const [tokens, setTokens] = useState(user.token);
    const [isLoading, setIsLoading] = useState(false);
    const alert = useAlert();

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await api.put(`/admin/users/${user.id}/tokens`, {token: Number(tokens)});
            onSuccess();
            onClose();
        } catch (err: any) {
            alert("Ouch...", err.response?.data?.message || "Failed to update tokens.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title={`Edit Tokens for ${user.username}`}
            onClose={onClose}
        >
            <div className="space-y-4 p-3">
                <div>
                    <label htmlFor="tokens" className="block text-sm font-medium text-secondary-700 mb-1">
                        Total Tokens
                    </label>
                    <input
                        id="tokens"
                        type="number"
                        value={tokens}
                        onChange={(e) => setTokens(Number(e.target.value))}
                        className="bg-background-dark text-white p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-accent-500"
                        min="0"
                    />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <Button onClick={onClose} label="Cancel" color="secondary"/>
                    <Button onClick={handleSave} disabled={isLoading} label={isLoading ? "Saving..." : "Save"}
                            color="primary"/>
                </div>
            </div>
        </Modal>
    );
};

export default EditTokenModal;