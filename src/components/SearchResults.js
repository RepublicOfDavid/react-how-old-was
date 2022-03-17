import KnownFor from './KnownFor'
import Card from 'react-bootstrap/Card'
import CardColumns from 'react-bootstrap/CardColumns'
import ListGroup from 'react-bootstrap/ListGroup'

const SearchResults = ({ results, onSelect }) => {
    return (
        <>
            <CardColumns>
                {results.map((result) => (
                    <Card key={result.id} onClick={() => onSelect(result.id, result.name, result.profile_path, result.birthday)} data-actors-name={result.name}>
                        <Card.Img className="pt-3 mx-auto d-block" variant="top" src={"https://image.tmdb.org/t/p/w90_and_h90_face" + result.profile_path}/>
                        <Card.Body>
                            <Card.Title className="mb-0"><h5 className="mb-0">{result.name}</h5></Card.Title>
                        </Card.Body>
                        <Card.Footer>
                            <small className="text-muted">
                                <h6>Known for:</h6>
                                <ListGroup>
                                    {result.known_for.map((known_for) => (
                                        <ListGroup.Item key={known_for.id}>
                                            <KnownFor key={known_for.id} knownFor={known_for} />
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </small>
                        </Card.Footer>
                    </Card>
                ))}
            </CardColumns>
        </>
    )
}

export default SearchResults