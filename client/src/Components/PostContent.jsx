import React from 'react';


const isHtml = (content) => /<\/?[a-z][\s\S]*>/i.test(content);

const PostContent = ({ content }) => {
  if (isHtml(content)) {
    return (
      <div className="post-content" dangerouslySetInnerHTML={{ __html: content }} />
    );
  }

  // Fallback for legacy \n\n-separated text
  return (
    <div className="post-content legacy-post">
      {content.split('\n\n').map((para, idx) => (
        <p key={idx}>
          {para.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
      ))}
    </div>
  );
};

export default PostContent;
