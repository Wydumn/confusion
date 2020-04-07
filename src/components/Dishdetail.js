import React, { useState} from 'react'
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb,BreadcrumbItem, Modal, ModalBody, ModalHeader, Button, Label, FormGroup, CardImgOverlay } from 'reactstrap'
import { LocalForm, Control} from 'react-redux-form'
import { Link } from 'react-router-dom'
import { Loading } from './Loading'
import { baseUrl } from '../shared/baseUrl'
import { FadeTransform, Fade, Stagger } from 'react-animation-components'

function RenderDish({ dish, favorite, postFavorite }) {
    if (dish != null) {
        return(
            <div className="col-12 col-md-5 m-1">
                <FadeTransform in 
                transformProps={{
                    exitTrnasform: 'scale(0.5) translateY(-50%)'
                }}
            >
                    <Card>
                        <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                        <CardImgOverlay>
                            <Button outline color="primary" onClick={ () => favorite
                                ? console.log('Already favorite')
                                : postFavorite(dish._id)}
                            >
                                {favorite 
                                    ? <span className="fa fa-heart"></span>
                                    : <span className="fa fa-heart-o"></span>
                                }
                            </Button>
                        </CardImgOverlay>
                        <CardBody>
                            <CardTitle>{dish.name}</CardTitle>
                            <CardText>{dish.description}</CardText>
                        </CardBody>
                    </Card>
                </FadeTransform>
            </div>
        );
    } else {
        return <div></div>
    }
}

function CommentForm({ dishId, postComment}) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const toggleModal = () => setIsModalOpen(!isModalOpen)

    const handleSubmit = (values) => {
        toggleModal()
        postComment(dishId, values.rating, values.comment)
    }

    return (
        <div>
        <Button outline onClick={toggleModal}>
            <span className="fa fa-pencil fa-lg">Submit Comment</span>
        </Button>
        <Modal isOpen={isModalOpen} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>Submit Comment</ModalHeader>
            <ModalBody>
                <LocalForm onSubmit={(values) => handleSubmit(values)}>
                    <FormGroup>
                        <Label htmlFor="rating">Rating</Label>
                        <Control.select model=".rating" name="rating"
                            placeholder="1"
                            className="form-control"
                        >
                            {
                                [1, 2, 3, 4, 5].map((item) => <option key={item}>{item}</option>)
                            }
                        </Control.select>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="comment">Comment</Label>
                        <Control.textarea model=".comment" id="comment" name="comment" rows="6" className="form-control" />
                    </FormGroup>
                    <Button type="submit" className="bg-primary">
                        Submit
                    </Button>
                </LocalForm>
            </ModalBody>
        </Modal>
        </div>
    )
}

function RenderComments ({comments, postComment, dishId}) {
    if (comments != null) {
        return (
            <div className="col-12 col-md-5 m-1">
                <h4>Comments</h4>
                <ul className="list-unstyled">
                    <Stagger in>
                        {comments.map(comment => {
                            return (
                                <Fade in key={comment._id}>
                                    <li>
                                        <p>{comment.comment}</p>
                                        <p>{comment.rating} stars</p>
                                        <p>-- {comment.author.firstname} {comment.author.lastname} {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.updatedAt)))}</p>
                                    </li>
                                </Fade>
                            )
                        })}
                    </Stagger>
                </ul>
                <CommentForm dishId={dishId} postComment={postComment} />
            </div>
        )
    } else {
        return <div></div>
    }
}


export default function DishDetail(props) {
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        )
    } else if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        )
    } else if (props.dish != null) {
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>Menu</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <RenderDish dish={props.dish} favorite={props.favorite} postFavorite={props.postFavorite} />
                    <RenderComments comments={props.comments} postComment={props.postComment} dishId={props.dish._id} />
                </div>
            </div>
        )
    } else {
        return <div></div>
    }
}