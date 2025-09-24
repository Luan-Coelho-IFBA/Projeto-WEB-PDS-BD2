import { useState } from "react";

import styles from "./styles.module.css";
import { ChevronDownIcon } from "lucide-react";
import type { DropdownOptions } from "../../types/DropdownOptions";
import { Controller, type Control, type FieldValues } from "react-hook-form";

interface MultiSelectDropdownProps {
    options: DropdownOptions[] | undefined;
    name: string;
    control: Control<FieldValues>;
}

export function MultiSelectDropdown({
    options,
    name,
    control,
}: MultiSelectDropdownProps) {
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    function handleClickOpenModal() {
        setShowDropdown(!showDropdown);
    }

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value = [] } }) => (
                <div>
                    <div
                        className={styles.container}
                        onClick={handleClickOpenModal}
                        style={{}}
                    >
                        {value.length > 0
                            ? `${value.length} selecionados`
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
                                    <div
                                        key={option.value}
                                        className={styles.item}
                                    >
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={options
                                                    .map((o) => o.value)
                                                    .includes(option.value)}
                                                onChange={() => {
                                                    const newValue =
                                                        value.includes(
                                                            option.value
                                                        )
                                                            ? value.filter(
                                                                  (v: number) =>
                                                                      v !==
                                                                      option.value
                                                              )
                                                            : [
                                                                  ...value,
                                                                  option.value,
                                                              ];
                                                    onChange(newValue);
                                                }}
                                            />
                                            {option.label}
                                        </label>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            )}
        />
    );
}
