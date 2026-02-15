interface SearchBarProps {
    currentSearch: string,
    handleTyping: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function SearchBar({currentSearch, handleTyping} : SearchBarProps) {
    return (
        <div>
            <input placeholder="search for an expense" value={currentSearch} onChange={handleTyping}>
            </input>
        </div>
    )

}