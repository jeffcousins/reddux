import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import parseDomain from 'parse-domain';

const smallGrayStyle = {
  'fontSize': 11,
  'color': 'gray'
};

const content = {
  'paddingTop': 15,
  'paddingBottom': 8
};

const PostItem = (props) => {
  const { title, username, createdAt, url, brew_name, id } = props.data;

  function urlHandler (providedUrl, title, brew_name, id) {
    if (!providedUrl) {
      return (
        <div>
          <Link to={`/b/${brew_name}/comments/${id}`}>{title}</Link>
        </div>
      );
    } else {
      const parsed = parseDomain(providedUrl);

      return (
        <div>
          <a href={providedUrl}>{title}</a> <span style={smallGrayStyle}>
            [ {parsed.domain}.{parsed.tld} ]
          </span>
        </div>
      );
    }
  }

  function inBrewName () {
    if (props.showBrew) {
      return (
        <span> in <Link to={`/b/${props.data.brew_name}`}
          style={{'color': '#21BA45'}}>{props.data.brew_name}</Link>
        </span>
      );
    }
  }

  const timeAgo = moment(createdAt).fromNow();

  return (
    <div className='item'>
      <div className='content' style={content}>
        <h3 className='header'>
          {urlHandler(url, title, brew_name, id)}
        </h3>
        <div className='description'>
          Submitted {timeAgo} by <Link to={`/u/${username}`}>{username}</Link>{inBrewName()}
        </div>
        <div className='extra'>
          <Link to={`/b/${brew_name}/comments/${id}`} style={smallGrayStyle}>Comments</Link>
        </div>
      </div>
    </div>
  );
};

const { object, bool } = React.PropTypes;

PostItem.propTypes = {
  data: object,
  showBrew: bool
};

export default PostItem;
