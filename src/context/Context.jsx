import React,{createContext, useState} from 'react'
import main from '../config/gemini'

export const Context = createContext()

const ContextProvider = (props) =>{

    const [input, setInput] = useState('')  //to save the input data
    const [recentPrompt, setRecentPrompt] = useState('')  //input field data will be sent here
    const [prevPrompts, setPrevPrompts] = useState([])    //array to store history
    const [showResult, setshowResult] = useState(false)   //show and hide default main page and display result
    const [loading, setLoading] = useState(false)         //for loading animation
    const [resultData, setResultData] = useState('')      //display result on page

    const delayPara = (index,nextWord)=>{
        setTimeout(() => {
            setResultData(prev => prev + nextWord)
        }, 75*index);
    }

    const newChat = ()=>{
        setLoading(false)
        setshowResult(false)
    }

    const onSent = async (prompt) => {
        setResultData('')
        setLoading(true)
        setshowResult(true)
        let response;
        if(prompt!== undefined){
            response = await main(prompt)
            setRecentPrompt(prompt)
        }
        else{
            setPrevPrompts(prev=>[...prev,input])
            setRecentPrompt(input)
            response = await main(input)   
        }
        
        let responseArray = response.split('**')
        let newResponse = '';
        for(let i=0; i<responseArray.length;i++){
            if(i===0 || i%2!==1){
                newResponse += responseArray[i]
            }else{
                newResponse += '<b style="font-weight:600">'+responseArray[i]+'</b>'
            }
        }
        let newResponse2 = newResponse.split('*').join('</br>')

        let newResponseArray = newResponse2.split(' ')
        for(let i =0 ;i< newResponseArray.length ;i++){
            const nextWord = newResponseArray[i]
            delayPara(i,nextWord + ' ')

        }
        setLoading(false)
        setInput('')
    }

     

    const contextValue ={
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat

    }
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider