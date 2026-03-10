import React, { useState, useEffect, useRef } from 'react'
import { Button, Card, Typography, Space, message, Select, Tooltip, Badge } from 'antd'
import { 
  SoundOutlined, 
  AudioOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  GlobalOutlined,
  MessageOutlined
} from '@ant-design/icons'

const { Text, Title } = Typography
const { Option } = Select

// Language translations
const translations = {
  en: {
    title: 'Voice Assistant',
    subtitle: 'Speak or type to fill form',
    selectLanguage: 'Select Language',
    cropType: 'Crop Type',
    quantity: 'Quantity',
    price: 'Expected Price',
    location: 'Location',
    tapToSpeak: 'Tap to Speak',
    speaking: 'Listening...',
    tryAgain: 'Try Again',
    notSupported: 'Voice not supported in this browser',
    instruction: 'Click microphone and speak',
    cropTypes: {
      wheat: 'wheat',
      rice: 'rice',
      corn: 'corn',
      soybean: 'soybean',
      cotton: 'cotton',
      sugarcane: 'sugarcane',
      potato: 'potato',
      tomato: 'tomato',
      onion: 'onion',
      mustard: 'mustard'
    }
  },
  hi: {
    title: 'वॉइस असिस्टेंट',
    subtitle: 'फॉर्म भरने के लिए बोलें या लिखें',
    selectLanguage: 'भाषा चुनें',
    cropType: 'फसल का प्रकार',
    quantity: 'मात्रा',
    price: 'अपेक्षित मूल्य',
    location: 'स्थान',
    tapToSpeak: 'बोलने के लिए टैप करें',
    speaking: 'सुन रहे हैं...',
    tryAgain: 'फिर से कोशिश करें',
    notSupported: 'इस ब्राउज़र में वॉइस समर्थित नहीं है',
    instruction: 'माइक्रोफ़ोन पर क्लिक करें और बोलें',
    cropTypes: {
      wheat: 'गेहूं',
      rice: 'चावल',
      corn: 'मक्का',
      soybean: 'सोयाबीन',
      cotton: 'कपास',
      sugarcane: 'गन्ना',
      potato: 'आलू',
      tomato: 'टमाटर',
      onion: 'प्याज',
      mustard: 'सरसों'
    }
  },
  mr: {
    title: 'व्हॉइस असिस्टंट',
    subtitle: 'फॉर्म भरण्यासाठी बोला किंवा लिहा',
    selectLanguage: 'भाषा निवडा',
    cropType: 'पिकाचे प्रकार',
    quantity: 'प्रमाण',
    price: 'अपेक्षित किंमत',
    location: 'स्थान',
    tapToSpeak: 'बोलण्यासाठी टॅप करा',
    speaking: 'ऐकत आहे...',
    tryAgain: 'पुन्हा प्रयत्न करा',
    notSupported: 'या ब्राउजरमध्ये व्हॉइस समर्थित नाही',
    instruction: 'मायक्रोफोनवर क्लिक करा आणि बोला',
    cropTypes: {
      wheat: 'गहू',
      rice: 'भात',
      corn: 'मका',
      soybean: 'सोयाबीन',
      cotton: 'कापूस',
      sugarcane: 'ऊस',
      potato: 'बटाटा',
      tomato: 'टोमॅटो',
      onion: 'कांदा',
      mustard: 'मोहरी'
    }
  }
}

const FarmerVoiceAssistant = ({ onFieldComplete, language = 'en' }) => {
  const [currentLanguage, setCurrentLanguage] = useState(language)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [recognizedText, setRecognizedText] = useState('')
  const [currentField, setCurrentField] = useState(null)
  const [isSupported, setIsSupported] = useState(true)
  
  const recognitionRef = useRef(null)
  const synthRef = useRef(null)

  // Check browser support on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }
    
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = getLanguageCode(currentLanguage)
    
    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      
      setRecognizedText(transcript)
      
      if (event.results[0].isFinal) {
        processSpeech(transcript)
      }
    }
    
    recognitionRef.current.onend = () => {
      setIsListening(false)
    }
    
    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      if (event.error === 'not-allowed') {
        message.error('Microphone permission denied')
      }
    }
    
    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [currentLanguage])

  const getLanguageCode = (lang) => {
    const codes = {
      en: 'en-US',
      hi: 'hi-IN',
      mr: 'mr-IN'
    }
    return codes[lang] || 'en-US'
  }

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang)
    if (recognitionRef.current) {
      recognitionRef.current.lang = getLanguageCode(lang)
    }
  }

  const startListening = (field) => {
    if (!isSupported) {
      message.warning(translations[currentLanguage].notSupported)
      return
    }
    
    setCurrentField(field)
    setRecognizedText('')
    setIsListening(true)
    
    try {
      recognitionRef.current.start()
    } catch (error) {
      console.error('Error starting recognition:', error)
      setIsListening(false)
    }
  }

  const processSpeech = (text) => {
    const t = translations[currentLanguage]
    const processedText = text.toLowerCase().trim()
    
    if (currentField === 'cropType') {
      // Match crop type
      const cropMatch = Object.keys(t.cropTypes).find(crop => 
        processedText.includes(crop) || 
        processedText.includes(t.cropTypes[crop])
      )
      
      if (cropMatch) {
        const displayCrop = cropMatch.charAt(0).toUpperCase() + cropMatch.slice(1)
        onFieldComplete('cropType', displayCrop)
        speak(`Selected ${displayCrop}`)
      } else {
        message.warning('Crop not recognized. Please try again.')
      }
    } else if (currentField === 'quantity') {
      // Extract numbers from speech
      const numbers = processedText.match(/\d+/g)
      if (numbers && numbers.length > 0) {
        const quantity = parseInt(numbers[0])
        if (quantity > 0 && quantity <= 10000) {
          onFieldComplete('quantity', quantity)
          speak(`${quantity} quintals`)
        } else {
          message.warning('Please specify a valid quantity between 1 and 10000')
        }
      } else {
        message.warning('Could not understand quantity. Please try again.')
      }
    } else if (currentField === 'price') {
      // Extract numbers from speech
      const numbers = processedText.match(/\d+/g)
      if (numbers && numbers.length > 0) {
        const price = parseInt(numbers[0])
        if (price > 0 && price <= 100000) {
          onFieldComplete('expectedPrice', price)
          speak(`₹${price} per quintal`)
        } else {
          message.warning('Please specify a valid price')
        }
      } else {
        message.warning('Could not understand price. Please try again.')
      }
    } else if (currentField === 'location') {
      // Simple location matching (states)
      const states = ['maharashtra', 'punjab', 'haryana', 'uttar pradesh', 'madhya pradesh', 
                      'gujarat', 'rajasthan', 'karnataka', 'tamil nadu', 'west bengal']
      const stateMatch = states.find(state => processedText.includes(state))
      
      if (stateMatch) {
        const formattedState = stateMatch.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join('_')
        
        onFieldComplete('state', formattedState)
        speak(`Selected ${stateMatch}`)
      } else {
        message.warning('State not recognized. Please try again.')
      }
    }
  }

  const speak = (text) => {
    if (!synthRef.current || !isSupported) return
    
    // Cancel any ongoing speech
    synthRef.current.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = getLanguageCode(currentLanguage)
    utterance.rate = 0.9
    utterance.pitch = 1
    
    setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    synthRef.current.speak(utterance)
  }

  const speakInstruction = () => {
    const t = translations[currentLanguage]
    const instructions = {
      cropType: `Please say the crop name, like wheat, rice, or ${t.cropTypes.wheat}`,
      quantity: 'Please say the quantity in quintals',
      price: 'Please say the expected price in rupees',
      location: 'Please say your state name'
    }
    
    if (currentField && instructions[currentField]) {
      speak(instructions[currentField])
    }
  }

  const t = translations[currentLanguage] || translations.en

  if (!isSupported) {
    return (
      <Card size="small" style={{ marginBottom: 16, background: '#fffbe6' }}>
        <Text type="warning">{t.notSupported}</Text>
        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
          Please use Chrome, Edge, or Safari browser for voice features.
        </Text>
      </Card>
    )
  }

  return (
    <Card 
      size="small" 
      style={{ 
        marginBottom: 16, 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        border: '1px solid #bae6fd'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Space>
          <MessageOutlined style={{ fontSize: 18, color: '#1890ff' }} />
          <Text strong>{t.title}</Text>
        </Space>
        
        <Select
          value={currentLanguage}
          onChange={handleLanguageChange}
          style={{ width: 100 }}
          size="small"
          suffixIcon={<GlobalOutlined />}
        >
          <Option value="en">🇺🇸 English</Option>
          <Option value="hi">🇮🇳 हिंदी</Option>
          <Option value="mr">🇮🇳 मराठी</Option>
        </Select>
      </div>

      <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
        {t.subtitle}
      </Text>

      {/* Voice Input Buttons */}
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Tooltip title={t.cropType}>
            <Button 
              type={currentField === 'cropType' ? 'primary' : 'default'}
              icon={<AudioOutlined />}
              onClick={() => {
                setCurrentField('cropType')
                startListening('cropType')
              }}
              loading={isListening && currentField === 'cropType'}
              style={{ flex: 1, minWidth: 120 }}
            >
              {t.cropType}
            </Button>
          </Tooltip>

          <Tooltip title={t.quantity}>
            <Button 
              type={currentField === 'quantity' ? 'primary' : 'default'}
              icon={<AudioOutlined />}
              onClick={() => {
                setCurrentField('quantity')
                startListening('quantity')
              }}
              loading={isListening && currentField === 'quantity'}
              style={{ flex: 1, minWidth: 120 }}
            >
              {t.quantity}
            </Button>
          </Tooltip>

          <Tooltip title={t.price}>
            <Button 
              type={currentField === 'price' ? 'primary' : 'default'}
              icon={<AudioOutlined />}
              onClick={() => {
                setCurrentField('price')
                startListening('price')
              }}
              loading={isListening && currentField === 'price'}
              style={{ flex: 1, minWidth: 120 }}
            >
              {t.price}
            </Button>
          </Tooltip>
        </div>

        {isListening && (
          <div style={{ 
            textAlign: 'center', 
            padding: 12, 
            background: '#fff',
            borderRadius: 8,
            border: '2px dashed #1890ff'
          }}>
            <Badge status="processing" />
            <Text strong style={{ marginLeft: 8 }}>{t.speaking}</Text>
            <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
              {recognizedText || t.instruction}
            </Text>
            <Button 
              size="small" 
              type="link" 
              onClick={speakInstruction}
              style={{ marginTop: 4 }}
            >
              <SoundOutlined /> Hear instruction
            </Button>
          </div>
        )}
      </Space>
    </Card>
  )
}

export default FarmerVoiceAssistant

