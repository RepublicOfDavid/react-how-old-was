import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Alert from 'react-bootstrap/Alert'

const ActorsFilmography = ({ name, dob, filmography, image, scroll }) => {

    const scrollToFilm = (id) => {
        document.getElementById(id).scrollIntoView({behavior: "smooth", block: 'center'});
    }

    return (
        <>
            <Col className="pt-2 pb-3">
                <Image width="100" className="mx-auto d-block" src={"https://image.tmdb.org/t/p/w100_and_h100_face" + image} roundedCircle />
            </Col>
            <div className={scroll ? "starred-in scrolling" : "starred-in not-scrolling"}>
                <p className="pt-2 pb-2">{scroll ? "How old was " + name + " when they starred in" : "When they starred in"}</p>
                <Form>
                    <Form.Group>
                        <Form.Control as="select" onChange={event => scrollToFilm(event.target.value)} >
                            {filmography.map((title) => {
                                const filmReleaseYear = title.release_date.substring(0, 4);
                                return (
                                    <option key={title.id} value={title.id}>{title.title} ({filmReleaseYear})</option>
                                )
                            })}

                        </Form.Control>
                    </Form.Group>
                </Form>
            </div>
            <div className="pt-5">
                {filmography.map((title) => {
                    // Work out age of actor when film was released
                    const filmReleaseYear = title.release_date.substring(0, 4);
                    const filmReleaseMonth = title.release_date.substring(5, 7);
                    const filmReleaseDay = title.release_date.substring(8, 10);
                    const filmReleaseDate = filmReleaseMonth + '/' + filmReleaseDay + '/' + filmReleaseYear;
                    const currentYear = new Date().getFullYear();
                    const actorsAge = currentYear - dob;
                    const filmAge = currentYear - filmReleaseYear;
                    let age = (actorsAge - filmAge);
                    age = CalcAge(dob, filmReleaseDate);

                    function CalcAge(dob, filmReleaseDate) {
                        const DoB = Date.parse(dob);
                        const FrD = Date.parse(filmReleaseDate);
                        let AgeDays = 0;
                        let AgeYears = 0;
                        let AgeMonths = 0;
                        const mSecDiff   = FrD - DoB;
                        AgeDays  = mSecDiff / 86400000;
                        AgeYears = AgeDays / 365.24;    
                        AgeYears = Math.floor(AgeYears);
                        AgeMonths  = (AgeDays - AgeYears * 365.24) / 30.4375;
                        AgeMonths  = Math.round(AgeMonths * 10) / 10;
                        return AgeYears + ' Years and ' + AgeMonths + ' Months' ;
                    }
                    return (
                        <Card className="text-center mb-3" key={title.id} id={title.id}>
                            <Card.Header>
                                <h4 className="pt-3">{title.title}</h4>
                                <Row className="pt-3 pb-3">
                                    <Image width="120" className="mx-auto d-block" src={"https://image.tmdb.org/t/p/w90_and_h90_face" + title.poster_path} roundedCircle />
                                </Row>
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>{name} was</Card.Title>
                                <Alert variant="success">
                                    <Alert.Heading>{age}</Alert.Heading>
                                </Alert>
                                <p>When {title.title} was released</p>
                            </Card.Body>
                        </Card>
                    )
                })}
            </div>
        </>
    )
}

export default ActorsFilmography