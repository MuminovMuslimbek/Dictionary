import React, { useRef, useEffect, useState } from 'react';
import Logo from './assets/logo.svg';
import MoonDark from './assets/moonDark.svg';
import Moon from './assets/moon.svg';
import Search from './assets/search.svg';
import Play from './assets/play.png'
import Pause from './assets/pause.png'
import Link from './assets/Link.svg'
import Smile from './assets/smile.png'
import axios from 'axios';


function App() {
    const fontRef = useRef(null);
    const InputRef = useRef(null)
    const [isChecked, setIsChecked] = useState(false);
    const [theme, setTheme] = useState('light');
    const [playMusic, setPlayMusic] = useState(false)
    const [data, setData] = useState([])
    const [notFound, setNotFound] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false)

    console.log(data)

    function handleFontChange() {
        if (fontRef.current) {
            const selectedFont = fontRef.current.value;
            document.body.style.fontFamily = selectedFont;
            localStorage.setItem('font', selectedFont);
        }
    }

    function handleTheme() {
        setIsChecked(!isChecked);
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    useEffect(() => {
        const savedFont = localStorage.getItem('font') || 'sans-serif';
        const savedTheme = localStorage.getItem('theme') || 'light';

        if (fontRef.current) {
            fontRef.current.value = savedFont;
            document.body.style.fontFamily = savedFont;
        }

        setTheme(savedTheme);
        setIsChecked(savedTheme === 'dark');
    }, []);

    useEffect(() => {
        const body = document.body;
        if (theme === 'light') {
            body.classList.remove('dark');
            body.classList.add('light');
            body.style.background = '#fff';
        } else {
            body.classList.remove('light');
            body.classList.add('dark');
            body.style.background = '#050505';
        }
    }, [theme]);

    function handleSubmit(event) {
        event.preventDefault()
        if (!InputRef.current || !InputRef.current.value.trim()) {
            setIsEmpty(true)
            InputRef.current.classList.add("outline-[#FF5252]")
            InputRef.current.focus()
            return
        }

        if (setNotFound(true)) {
            setNotFound(false)
        }

        axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${InputRef.current.value}`)
            .then(response => {
                setData(response.data)
            })
            .catch(err => {
                console.log(err)
                setNotFound(true)
                InputRef.current.value = ''
            })
            .finally(() => {
                InputRef.current.value = ''
            })

    }

    function handleSound(audioSrc) {
        setPlayMusic(true);
        const audio = document.createElement('audio');
        audio.src = audioSrc;
        audio.play();

        audio.onended = function () {
            setPlayMusic(false);
        }
    }


    return (
        <div className="max-w-[737px] w-full mx-auto">
            <header className="flex justify-between my-[55px] select-none">
                <a href="../index.html"><img src={Logo} className='pointer-events-none' alt="Logo" /></a>
                <div className="flex gap-5 items-center">
                    <select id="select" className="cursor-pointer text-lg transition-[0.3s] capitalize font-bold outline-none bg-transparent text-gray-800 dark:text-white dark:bg-[#050505] relative after:absolute after:-bottom-6 after:bg-gray-400 after:h-[1px] after:w-full after:transition-all dark:after:bg-[#A445ED] hover:after:w-[90%]" ref={fontRef} onChange={handleFontChange}>
                        <option value="sans-serif">Sans Serif</option>
                        <option value="serif">serif</option>
                        <option value="cursive">cursive</option>
                        <option value="fantasy">fantasy</option>
                        <option value="monospace">monospace</option>
                        <option value="Courier New">Courier New</option>
                    </select>
                    <label className="relative transition-[0.3s] inline-flex items-center gap-[20px] cursor-pointer ">
                        <input type="checkbox" className="sr-only peer" checked={isChecked} onChange={handleTheme} />
                        <div className="w-11 h-6 bg-[#757575] rounded-full peer-checked:bg-[#A445ED] transition duration-300"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition duration-300"></div>
                        {isChecked ? <img className='pointer-events-none' src={Moon} /> : <img className='pointer-events-none' src={MoonDark} />}
                    </label>
                </div>
            </header >
            <main>
                <form onSubmit={handleSubmit} className='relative select-none'>
                    <input ref={InputRef} className='w-full transition-[0.3s] py-[20px] text-[20px] text-[#2D2D2D] dark:text-white outline-[#A445ED] font-bold px-[24px] bg-[#F4F4F4] dark:bg-[#1F1F1F] rounded-[16px]' type="text" placeholder='Search for any word…' />
                    <button className='cursor-pointer' type='submit'><img className='absolute top-[24px] z-10 right-[25px] pointer-events-none' src={Search} /></button>
                </form>
                <div className='text-[#2D2D2D] dark:text-white'>
                    {
                        notFound ?
                            <div className='flex flex-col items-center text-center mt-[132px]'>
                                <img src={Smile} />
                                <h3 className='mt-[44px] text-[#2D2D2D] text-[20px] font-bold dark:text-white'>No Definitions Found</h3>
                                <p className='text-[19px] text-[#757575] font-normal mt-[24px]'>Sorry pal, we couldn't find definitions for the word you were looking for. You can try the search again at later time or head to the web instead.</p>
                            </div>
                            : ''
                    }
                    {
                        isEmpty ?
                            <p className='text-[#FF5252] mt-[8px] text-[20px] font-normal select-none'>Whoops, can’t be empty…</p>
                            : ''
                    }
                    {
                        data && data[0] && data[0].meanings && data[0].meanings.length > 0 && (
                            <div key={0} className='py-[40px]'>
                                <div className='flex justify-between items-center'>
                                    <div className='flex flex-col'>
                                        <h1 className='text-[#2D2D2D] text-[64px] font-bold dark:text-white'>{data[0].word}</h1>
                                        <p className='text-[#A445ED] text-[24px] font-normal'>{data[0].phonetic}</p>
                                    </div>
                                    <button onClick={() => handleSound(data[0].phonetics[0]?.audio || data[0].phonetics[1]?.audio || data[0].phonetics[2]?.audio || '')} className='py-[27px] pr-[25px] pl-[27px] bg-[#E8D0FA] dark:bg-[#2D153F] select-none rounded-full active:scale-95 transition-[0.3s]'>
                                        <img src={playMusic ? Pause : Play} />
                                    </button>
                                </div>
                                <div className='flex flex-col'>
                                    <div className='flex justify-between items-center pt-[40px]'>
                                        <p className='text-[#2D2D2D] text-[24px] font-bold dark:text-white'>{data[0].meanings[0].partOfSpeech}</p>
                                        <div className='h-[1px] max-w-[656px] w-full bg-[#E9E9E9] dark:bg-[#3A3A3A]'></div>
                                    </div>
                                    <div className='mt-[40px]'>
                                        <h3 className='text-[#757575] text-[20px] font-normal'>Meaning</h3>
                                        <ul className='pl-[22px] flex flex-col gap-[13px] mt-[25px]'>
                                            {
                                                data[0].meanings[0].definitions && data[0].meanings[0].definitions.map((value, index) => (
                                                    <li className="list-disc text-[18px] text-[#2D2D2D] dark:text-white font-normal" key={index}>{value.definition}</li>
                                                ))
                                            }
                                        </ul>
                                        <p className='text-[#757575] text-[20px] font-normal flex gap-[5px] mt-[40px]'>Synonyms
                                            {
                                                data[0].meanings[0].synonyms && data[0].meanings[0].synonyms.map((value, index) => (
                                                    <span className='text-[#A445ED] font-bold' key={index}>{value}{index < data[0].meanings[0].synonyms.length - 1 && ', '}</span>
                                                ))
                                            }
                                        </p>
                                    </div>
                                    <div className='flex justify-between items-center pt-[40px]'>
                                        <p className='text-[#2D2D2D] text-[24px] font-bold dark:text-white'>{data[0].meanings[1].partOfSpeech}</p>
                                        <div className='h-[1px] max-w-[656px] w-full bg-[#E9E9E9] dark:bg-[#3A3A3A]'></div>
                                    </div>
                                    <div className='mt-[40px]'>
                                        <h3 className='text-[#757575] text-[20px] font-normal'>Meaning</h3>
                                        <ul className='pl-[22px] flex flex-col gap-[13px] mt-[25px]'>
                                            {
                                                data[0].meanings[1].definitions && data[0].meanings[1].definitions.map((value, index) => (
                                                    <li className="list-disc text-[18px] text-[#2D2D2D] dark:text-white font-normal" key={index}>
                                                        {value.definition}
                                                        {value.example && <p className='text-[#757575] text-[18px] font-normal mt-[5px]'>“{value.example}”</p>}
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                    <div className='flex gap-[20px] items-center my-[40px]'>
                                        <h4 className='text-[#757575] text-[14px] font-normal underline'>Source</h4>
                                        <a target='_blank' className='hover:underline text-[#2D2D2D] text-[14px] font-normal flex gap-[9px] items-center dark:text-white' href={data[0].sourceUrls}>{data[0].sourceUrls} <img src={Link} /></a>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </main>
        </div>
    );
}

export default App;
