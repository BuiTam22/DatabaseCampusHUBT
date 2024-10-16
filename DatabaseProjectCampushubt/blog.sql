CREATE TABLE [dbo].[User] (
    [user_id]       INT           IDENTITY (1, 1) NOT NULL,
    [username]      VARCHAR (255) NOT NULL,
    [full_name]     VARCHAR (255) NULL,
    [address]       VARCHAR (255) NULL,
    [school]        VARCHAR (255) NULL,
    [email]         VARCHAR (255) NOT NULL,
    [phone_number]  VARCHAR (20)  NULL,
    [password_hash] VARCHAR (255) NOT NULL,
    [role]          VARCHAR (50)  NOT NULL,
    [created_at]    DATETIME      DEFAULT (getdate()) NULL,
    [updated_at]    DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([user_id] ASC),
    CHECK ([role]='student' OR [role]='teacher' OR [role]='admin'),
    CONSTRAINT [chk_email_format] CHECK ([email] like '%_@__%.__%'),
    UNIQUE NONCLUSTERED ([email] ASC),
    UNIQUE NONCLUSTERED ([username] ASC)
);

CREATE TABLE [dbo].[Blog] (
    [blog_id]    INT           IDENTITY (1, 1) NOT NULL,
    [author_id]  INT           NOT NULL,
    [title]      VARCHAR (255) NOT NULL,
    [content]    TEXT          NOT NULL,
    [created_at] DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([blog_id] ASC),
    FOREIGN KEY ([author_id]) REFERENCES [dbo].[User] ([user_id])
);
CREATE TABLE [dbo].[Blog_Comment] (
    [comment_id] INT          IDENTITY (1, 1) NOT NULL,
    [blog_id]    INT          NOT NULL,
    [user_id]    INT          NOT NULL,
    [content]    TEXT         NOT NULL,
    [rank_flag]  VARCHAR (50) NULL,
    [created_at] DATETIME     DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([comment_id] ASC),
    FOREIGN KEY ([blog_id]) REFERENCES [dbo].[Blog] ([blog_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);

CREATE TABLE [dbo].[QnA] (
    [question_id] INT      IDENTITY (1, 1) NOT NULL,
    [user_id]     INT      NOT NULL,
    [question]    TEXT     NOT NULL,
    [answer]      TEXT     NULL,
    [created_at]  DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([question_id] ASC),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);