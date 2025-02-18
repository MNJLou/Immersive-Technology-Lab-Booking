import { useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { comboboxItem, comboboxProps } from "../../libs/interfaces";

export default function ComboboxComponent({ items, selectedItem, setSelectedItem, error = '', setError = undefined }: comboboxProps) {

    const [query, setQuery] = useState('')

    const filtered =
        query === ''
            ? items
            : items.filter((item) =>
                item.name
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            )

    return (
        <div className="combobox-container w-full relative z-10">
            <Combobox value={selectedItem} onChange={setSelectedItem} >
                <div className="combobox relative mt-1">
                    <div className=" w-full cursor-default rounded-md bg-white text-left focus:outline-none">
                        <Combobox.Input
                            className={"w-full text-sm text-black" + (error ? " border-red-500 border-2" : "")}
                            displayValue={(item: comboboxItem) => item.name}
                            onChange={(event) => setQuery(event.target.value)}
                            onBlur={setError ? () => setError('') : undefined}
                        />
                        <Combobox.Button className="combobox-button absolute inset-y-0 right-0 flex items-center">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-black/75"
                                aria-hidden="true"
                            />
                        </Combobox.Button>
                    </div>
                    <Combobox.Options className="absolute max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-main focus:outline-none sm:text-sm">
                        {filtered.length === 0 && query !== '' ? (
                            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                Nothing found.
                            </div>
                        ) : (
                            filtered.map((item: comboboxItem) => (
                                <Combobox.Option key={item.id} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${ active ? 'bg-primary text-white' : 'text-black/75' }`} value={item} hidden={ item.id === 0 ? true : false } >
                                    {({ selected, active }) => (
                                        <>
                                            <span className={`block truncate ${ selected ? 'font-medium' : 'font-normal' }`} >
                                              {item.name}
                                            </span>
                                            {selected ? (
                                                <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'}`}>
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Combobox.Option>
                            ))
                        )}
                    </Combobox.Options>
                </div>
            </Combobox>
        </div>
    )
}

