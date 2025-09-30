import { MouseEvent, useState } from "react";

import styles from "./styles.module.css";
import { ChevronDownIcon } from "lucide-react";
import type { DropdownOptions } from "../../types/DropdownOptions";
import { Controller, type Control, type FieldValues } from "react-hook-form";

interface MultiSelectDropdownProps {
    options: DropdownOptions[] | undefined;
    name: string;
    control: Control<FieldValues>;
    initialValue?: number[];
}

export function MultiSelectDropdown({
    options,
    name,
    control,
    initialValue = [],
}: MultiSelectDropdownProps) {
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    function handleClickOpenModal(e: MouseEvent) {
        setShowDropdown(!showDropdown);
        e.stopPropagation();
    }

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={initialValue}
            render={({ field: { onChange, value } }) => (
                <div>
                    <div
                        tabIndex={0}
                        className={styles.container}
                        onClick={(e) => handleClickOpenModal(e)}
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
                                                value={option.value}
                                                checked={value.includes(
                                                    option.value
                                                )}
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
