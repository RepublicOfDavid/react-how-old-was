import { useState, useRef, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import SearchResults from './components/SearchResults'
import ActorsFilmography from './components/ActorsFilmography'


const App = () => {

  const [results, setResults] = useState([])
  const [filmography, setFilmography] = useState()
  const [name, setName] = useState([])
  const [dob, setDob] = useState([])
  const [image, setImage] = useState([])
  const [scroll, setScroll] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchedRef = useRef()


  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 50);
    });
  }, []);


  const handleSearch = async () => {

    setLoading(true)

    setResults([])
    setFilmography()
    setName([])
    setDob([])
    setImage([])

    let searched = searchedRef.current.value
    searched = searched.replace(/</g, "&lt;").replace(/>/g, "&gt;").toLowerCase();

    if (searched !== "" && /[a-zA-Z]/.test(searched) && searched.length > 2) {

      let res

      if (process.env.NODE_ENV === "development") {

        if (process.env.REACT_APP_GET_EXTERNAL_API === "on") {
          res = await fetch(`${process.env.REACT_APP_GET_ACTORS}${searched}`)
        } else {
          res = await fetch('mock/getactors.json')
        }

      } else {
        res = await fetch(`/.netlify/functions/getactors?searched=${searched}`)
      }

      let data = await res.json()

      let updatedSearch = data.results.filter(function( obj ) {
        return (
           (obj.profile_path !== null) &&
           (obj.known_for !== null) &&
           (obj.known_for_department === 'Acting' || obj.known_for_department === 'Directing')
        )
      });

      res = null
      data = null

      await Promise.all(updatedSearch.map(async (element) => {

        if (process.env.NODE_ENV === "development") {

          if (process.env.REACT_APP_GET_EXTERNAL_API === "on") {
            res = await fetch(`${process.env.REACT_APP_GET_ACTOR}${element.id}${process.env.REACT_APP_GET_API_KEY}`)
          } else {
            res = await fetch('mock/getactor.json')
          }

        } else {
          res = await fetch(`/.netlify/functions/getactor?id=${element.id}`)
        }

        data = await res.json()
        element.birthday = data.birthday;
      }));

      updatedSearch = updatedSearch.filter((element) => element.birthday !== null);

      setResults(updatedSearch)

    }

    setLoading(false)

  }


  const scrollToFilmography = () => {
    window.scrollTo({ top: 0/*, behavior: 'smooth'*/ });
  }


  const getFilmography = async (id, name, image, birthday) => {

    setLoading(true)

    searchedRef.current.value = name;

    const dobRaw = birthday
    const dobYear = dobRaw.substring(0, 4);
    const dobMonth = dobRaw.substring(5, 7);
    const dobDay = dobRaw.substring(8, 10);
    const dob = dobMonth + '/' + dobDay + '/' + dobYear

    // Set Filmography

    let res

    if (process.env.NODE_ENV === "development") {

      if (process.env.REACT_APP_GET_EXTERNAL_API === "on") {
        res = await fetch(`${process.env.REACT_APP_GET_FILMOGRAPHY_ONE}${id}${process.env.REACT_APP_GET_FILMOGRAPHY_TWO}${process.env.REACT_APP_GET_API_KEY}`)
      } else {
        res = await fetch('mock/getfilmography.json')
      }

    } else {
      res = await fetch(`/.netlify/functions/getfilmography?id=${id}`)
    }

    let data = await res.json()

    let updatedFilmography = data.cast.filter(function( obj ) {
      return (
          obj.release_date !== null &&
          obj.release_date !== undefined &&
          obj.release_date !== "" &&
          obj.character !== null &&
          obj.character !== "" &&
          obj.character.indexOf('Himself') === -1 &&
          obj.character.indexOf('himself') === -1 &&
          obj.character.indexOf('Self') === -1 &&
          obj.character.indexOf('self') === -1  &&
          obj.character.indexOf('Herself') === -1 &&
          obj.character.indexOf('herself') === -1 &&
          obj.character.indexOf('uncredited') === -1 &&
          obj.character.indexOf('archive') === -1 &&
          obj.character.indexOf('Voice') === -1 &&
          obj.character.indexOf('voice') === -1 &&
          new Date(obj.release_date) < new Date() &&
          obj.poster_path !== null
      )
    });

    updatedFilmography = updatedFilmography.sort(function(a,b){
      return new Date(a.release_date) - new Date(b.release_date);
    });

    setFilmography(updatedFilmography)
    setName(name)
    setDob(dob)
    setImage(image)
    setResults([])
    scrollToFilmography();

    setLoading(false)
      
  }


  function clear() {
    searchedRef.current.value = null
    setResults([])
    setFilmography()
    setName([])
    setDob([])
    setImage([])
  }


  return (
    <Container className="pt-4">

      <Row>
        <Col xs={12} md={{ span: 8, offset: 2 }}>
          { filmography ? <Button onClick={clear} className="new-search" variant="secondary" size="lg" block>New Search</Button> : null }
          <Form>
            <Form.Group>
              <h1>HOW OLD WAS</h1>
              <Form.Control type="text" style={{textAlign: 'center'}} ref={searchedRef} placeholder="Actors Name" onChange={handleSearch}/>
            </Form.Group>
          </Form>

          { loading === true ? <div className="loading pt-5"><img src="/images/loading.gif" alt="loading"/></div> : <SearchResults results={results} onSelect={getFilmography} /> }

          <div id="filmography">
            { filmography ? loading === true ? <div className="loading pt-5"><img src="/images/loading.gif" alt="loading"/></div> : <ActorsFilmography filmography={filmography} name={name} dob={dob} image={image} scroll={scroll} /> : null }
          </div>
          <footer className="pt-5 pb-5">
              <Image width="250" className="mx-auto d-block" src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_2-9665a76b1ae401a510ec1e0ca40ddcb3b0cfe45f1d51b77a308fea0845885648.svg" title="The Movie Database" alt="The Movie Database"/>
            <p className="mt-2">This product uses the TMDb API but is not endorsed or certified by TMDb</p>
            <span className="version">v1.1.2</span>
          </footer>
        </Col>
      </Row>
    </Container>
  )

}

export default App
