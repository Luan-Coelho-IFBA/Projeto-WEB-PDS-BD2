import { useState } from "react";

import styles from "./styles.module.css";
import { ChevronDownIcon } from "lucide-react";

interface MultiSelectDropdownProps {
    options: string[] | undefined;
}

export function MultiSelectDropdown({ options }: MultiSelectDropdownProps) {
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const handleCheckboxChange = (option: string) => {
        if (selectedItems.includes(option)) {
            setSelectedItems(selectedItems.filter((item) => item !== option));
        } else {
            setSelectedItems([...selectedItems, option]);
        }
    };

    function handleClickOpenModal() {
        setShowDropdown(!showDropdown);
    }

    return (
        <div>
            <div
                className={styles.container}
                onClick={handleClickOpenModal}
                style={{}}
            >
                {selectedItems.length > 0
                    ? `${selectedItems.length} selecionados`
                    : "Selecione as opções"}
                <ChevronDownIcon
                    className={`${styles.icon} ${
                        showDropdown ? styles.iconRotated : ""
                    }`}
                />
            </div>
            {showDropdown && (
                <div className={styles.listContainer}>
                    {options &&
                        options.map((option) => (
                            <div key={option} className={styles.item}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(option)}
                                        onChange={() =>
                                            handleCheckboxChange(option)
                                        }
                                    />
                                    {option}
                                </label>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
