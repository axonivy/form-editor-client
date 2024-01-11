
export const RightSection = () => {
    const toggleSidebar = () => {
        document.getElementsByClassName('properties-sidebar')[0].classList.toggle('show');
    }
    return (
        <div>
            <button>
                <p>button1</p>
            </button>
            <button onClick={toggleSidebar}>
                <p>button2</p>
            </button>
        </div>
    )
}