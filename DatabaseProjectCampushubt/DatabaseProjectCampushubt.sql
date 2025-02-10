CREATE TABLE [dbo].[Users] (
    [UserID]           INT            IDENTITY (1, 1) NOT NULL,
    [Username]         NVARCHAR (50)  NOT NULL,
    [Email]            NVARCHAR (100) NOT NULL,
    [Password]         NVARCHAR (255) NULL,
    [Image]            NVARCHAR (255) NULL,
    [CreatedAt]        DATETIME       DEFAULT (getdate()) NULL,
    [LastLogin]        DATETIME       NULL,
    [Status]           VARCHAR (20)   DEFAULT ('offline') NULL,
    [Role]             VARCHAR (20)   DEFAULT ('user') NULL,
    [AccountStatus]    VARCHAR (20)   DEFAULT ('active') NULL,
    [ResetToken]       NVARCHAR (100) NULL,
    [ResetTokenExpiry] DATETIME       NULL,
    [IsDeleted]        BIT            DEFAULT ((0)) NULL,
    [Bio]              NVARCHAR (500) NULL,
    [CoverImage]       NVARCHAR (255) NULL,
    [LastLogout]       DATETIME       NULL,
    [FullName]         NVARCHAR (100) NULL,
    [Provider]         VARCHAR (20)   DEFAULT ('local') NULL,
    [GoogleID]         NVARCHAR (100) NULL,
    PRIMARY KEY CLUSTERED ([UserID] ASC),
    CHECK ([AccountStatus]='banned' OR [AccountStatus]='suspended' OR [AccountStatus]='active'),
    CHECK (OR [Role]='admin' OR [Role]='teacher' OR [Role]='student'),
    UNIQUE NONCLUSTERED ([Email] ASC),
    CONSTRAINT [UQ_Username] UNIQUE NONCLUSTERED ([Username] ASC)
);

CREATE TABLE [dbo].[GroupCallParticipants] (
    [ParticipantID] INT IDENTITY (1, 1) NOT NULL,
    [GroupCallID]   INT NOT NULL,
    [UserID]        INT NOT NULL,
    PRIMARY KEY CLUSTERED ([ParticipantID] ASC),
    CONSTRAINT [FK_GroupCall] FOREIGN KEY ([GroupCallID]) REFERENCES [dbo].[GroupCalls] ([GroupCallID]) ON DELETE CASCADE,
    CONSTRAINT [FK_User_GroupCall] FOREIGN KEY ([UserID]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Messages] (
    [message_id]  INT      IDENTITY (1, 1) NOT NULL,
    [sender_id]   INT      NOT NULL,
    [receiver_id] INT      NOT NULL,
    [content]     TEXT     NOT NULL,
    [sent_at]     DATETIME DEFAULT (getdate()) NULL,
    [chat_room_id] INT NULL,
    [message_type] VARCHAR(20) CHECK (message_type IN ('text', 'image', 'video', 'file')),
    [media_url] NVARCHAR(255) NULL,
    PRIMARY KEY CLUSTERED ([message_id] ASC),
    FOREIGN KEY ([receiver_id]) REFERENCES [dbo].[User] ([user_id]),
    FOREIGN KEY ([sender_id]) REFERENCES [dbo].[User] ([user_id]),
    CONSTRAINT [FK_Messages_ChatRoom] 
    FOREIGN KEY ([chat_room_id]) REFERENCES [dbo].[Chat_Room]([room_id])
);


GO

CREATE TABLE [dbo].[Match_User] (
    [match_user_id] INT IDENTITY (1, 1) NOT NULL,
    [match_id]      INT NOT NULL,
    [user_id]       INT NOT NULL,
    [score]         INT NULL,
    [rank_position] INT NULL,
    PRIMARY KEY CLUSTERED ([match_user_id] ASC),
    CHECK ([rank_position]>=(0)),
    CHECK ([score]>=(0)),
    FOREIGN KEY ([match_id]) REFERENCES [dbo].[Match] ([match_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Ratings] (
    [rating_id] INT      IDENTITY (1, 1) NOT NULL,
    [user_id]   INT      NOT NULL,
    [course_id] INT      NOT NULL,
    [rating]    INT      NOT NULL,
    [comment]   TEXT     NULL,
    [rated_at]  DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([rating_id] ASC),
    CHECK ([rating]>=(1) AND [rating]<=(5)),
    FOREIGN KEY ([course_id]) REFERENCES [dbo].[Course] ([course_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Admin] (
    [admin_id]     INT      IDENTITY (1, 1) NOT NULL,
    [user_id]      INT      NOT NULL,
    [access_level] INT      NOT NULL,
    [created_at]   DATETIME DEFAULT (getdate()) NULL,
    [updated_at]   DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([admin_id] ASC),
    CHECK ([access_level]>=(1) AND [access_level]<=(10)),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Shares] (
    [ShareID]   INT      IDENTITY (1, 1) NOT NULL,
    [Blog_ID]   INT      NOT NULL,
    [UserID]    INT      NOT NULL,
    [ShareDate] DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([ShareID] ASC),
    CONSTRAINT [FK_Blog_Shares] FOREIGN KEY ([Blog_ID]) REFERENCES [dbo].[Blog] ([blog_id]),
    CONSTRAINT [FK_User_Shares] FOREIGN KEY ([UserID]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Comment] (
    [comment_id] INT      IDENTITY (1, 1) NOT NULL,
    [user_id]    INT      NOT NULL,
    [problem_id] INT      NOT NULL,
    [content]    TEXT     NOT NULL,
    [created_at] DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([comment_id] ASC),
    FOREIGN KEY ([problem_id]) REFERENCES [dbo].[Problem] ([problem_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Blog] (
    [blog_id]    INT           IDENTITY (1, 1) NOT NULL,
    [author_id]  INT           NOT NULL,
    [title]      VARCHAR (255) NOT NULL,
    [content]    TEXT          NOT NULL,
    [created_at] DATETIME      DEFAULT (getdate()) NULL,
    [status] VARCHAR(20) DEFAULT('public') CHECK (status IN ('public', 'private', 'draft')),
    [post_type] VARCHAR(20) DEFAULT('normal') CHECK (post_type IN ('normal', 'announcement', 'event')),
    PRIMARY KEY CLUSTERED ([blog_id] ASC),
    FOREIGN KEY ([author_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Rank] (
    [rank_id]        INT            IDENTITY (1, 1) NOT NULL,
    [user_id]        INT            NOT NULL,
    [category_id]    INT            NOT NULL,
    [total_score]    INT            NULL,
    [detailed_score] NVARCHAR (MAX) NULL,
    [rank_position]  INT            NULL,
    [updated_at]     DATETIME       DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([rank_id] ASC),
    CHECK ([rank_position]>=(0)),
    CHECK ([total_score]>=(0)),
    FOREIGN KEY ([category_id]) REFERENCES [dbo].[Category] ([category_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Submission] (
    [submission_id] INT          IDENTITY (1, 1) NOT NULL,
    [user_id]       INT          NOT NULL,
    [problem_id]    INT          NOT NULL,
    [status]        VARCHAR (50) NOT NULL,
    [runtime]       INT          NULL,
    [memory_used]   INT          NULL,
    [score]         INT          NULL,
    [submitted_at]  DATETIME     DEFAULT (getdate()) NULL,
    [status_id]     INT          NOT NULL,
    [code]          TEXT         NOT NULL,
    [language]      VARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([submission_id] ASC),
    CHECK ([language]='HTML/CSS' OR [language]='PHP' OR [language]='Swift' OR [language]='Go' OR [language]='JavaScript' OR [language]='C#' OR [language]='C++' OR [language]='C' OR [language]='Java' OR [language]='Python'),
    CHECK ([memory_used]>=(0)),
    CHECK ([runtime]>=(0)),
    CHECK ([score]>=(0)),
    CHECK ([status]='Compilation Error' OR [status]='Runtime Error' OR [status]='Wrong Answer' OR [status]='Accepted'),
    FOREIGN KEY ([problem_id]) REFERENCES [dbo].[Problem] ([problem_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id]),
    CONSTRAINT [fk_submission_status] FOREIGN KEY ([status_id]) REFERENCES [dbo].[Submission_Status] ([status_id])
);


GO

CREATE TABLE [dbo].[Problem] (
    [problem_id]    INT           IDENTITY (1, 1) NOT NULL,
    [title]         VARCHAR (255) NOT NULL,
    [description]   TEXT          NOT NULL,
    [input_format]  TEXT          NULL,
    [output_format] TEXT          NULL,
    [constraints]   TEXT          NULL,
    [sample_input]  TEXT          NULL,
    [sample_output] TEXT          NULL,
    [time_limit]    INT           NULL,
    [memory_limit]  INT           NULL,
    [category_id]   INT           NOT NULL,
    [created_at]    DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([problem_id] ASC),
    CHECK ([memory_limit]>(0)),
    CHECK ([time_limit]>(0)),
    FOREIGN KEY ([category_id]) REFERENCES [dbo].[Category] ([category_id]) ON DELETE CASCADE
);


GO

CREATE TABLE [dbo].[Course] (
    [course_id]   INT           IDENTITY (1, 1) NOT NULL,
    [course_name] VARCHAR (255) NOT NULL,
    [description] TEXT          NULL,
    [creator_id]  INT           NOT NULL,
    [created_at]  DATETIME      DEFAULT (getdate()) NULL,
    [updated_at]  DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([course_id] ASC),
    FOREIGN KEY ([creator_id]) REFERENCES [dbo].[User] ([user_id]) ON DELETE CASCADE
);


GO

CREATE TABLE [dbo].[Submission_Status] (
    [status_id] INT          IDENTITY (1, 1) NOT NULL,
    [status]    VARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([status_id] ASC)
);


GO

CREATE TABLE [dbo].[Assignment_Manager] (
    [manager_id]      INT      IDENTITY (1, 1) NOT NULL,
    [manager_user_id] INT      NOT NULL,
    [student_user_id] INT      NOT NULL,
    [problem_id]      INT      NOT NULL,
    [assigned_at]     DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([manager_id] ASC),
    FOREIGN KEY ([manager_user_id]) REFERENCES [dbo].[User] ([user_id]),
    FOREIGN KEY ([problem_id]) REFERENCES [dbo].[Problem] ([problem_id]),
    FOREIGN KEY ([student_user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Match_Rank] (
    [rank_id]       INT      IDENTITY (1, 1) NOT NULL,
    [match_id]      INT      NOT NULL,
    [user_id]       INT      NOT NULL,
    [total_score]   INT      NULL,
    [rank_position] INT      NULL,
    [created_at]    DATETIME DEFAULT (getdate()) NULL,
    [updated_at]    DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([rank_id] ASC),
    CHECK ([rank_position]>=(0)),
    CHECK ([total_score]>=(0)),
    FOREIGN KEY ([match_id]) REFERENCES [dbo].[Match] ([match_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Class] (
    [class_id]   INT           IDENTITY (1, 1) NOT NULL,
    [class_name] VARCHAR (255) NOT NULL,
    [teacher_id] INT           NOT NULL,
    [created_at] DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([class_id] ASC),
    FOREIGN KEY ([teacher_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Admin_Activity] (
    [activity_id] INT           IDENTITY (1, 1) NOT NULL,
    [admin_id]    INT           NOT NULL,
    [action]      VARCHAR (255) NOT NULL,
    [target_type] VARCHAR (50)  NOT NULL,
    [target_id]   INT           NULL,
    [timestamp]   DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([activity_id] ASC),
    CHECK ([target_type]='Course' OR [target_type]='Problem' OR [target_type]='User'),
    FOREIGN KEY ([admin_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

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


GO

CREATE TABLE [dbo].[Error_Report] (
    [report_id]     INT      IDENTITY (1, 1) NOT NULL,
    [user_id]       INT      NOT NULL,
    [error_message] TEXT     NOT NULL,
    [created_at]    DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([report_id] ASC),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

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


GO

CREATE TABLE [dbo].[Course_Student] (
    [course_id]  INT          NOT NULL,
    [student_id] INT          NOT NULL,
    [joined_at]  DATETIME     DEFAULT (getdate()) NULL,
    [role]       VARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([course_id] ASC, [student_id] ASC),
    CHECK ([role]='student' OR [role]='instructor'),
    FOREIGN KEY ([course_id]) REFERENCES [dbo].[Course] ([course_id]),
    FOREIGN KEY ([student_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[PasswordReset] (
    [reset_id]    INT           IDENTITY (1, 1) NOT NULL,
    [user_id]     INT           NOT NULL,
    [reset_token] VARCHAR (255) NOT NULL,
    [created_at]  DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([reset_id] ASC),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Submission_TestCase_Result] (
    [result_id]     INT          IDENTITY (1, 1) NOT NULL,
    [submission_id] INT          NOT NULL,
    [testcase_id]   INT          NOT NULL,
    [status]        VARCHAR (50) NOT NULL,
    [runtime]       INT          NULL,
    [memory_used]   INT          NULL,
    [actual_output] TEXT         NULL,
    [error_message] TEXT         NULL,
    [graded_at]     DATETIME     DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([result_id] ASC),
    CHECK ([status]='Memory Limit Exceeded' OR [status]='Compilation Error' OR [status]='Time Limit Exceeded' OR [status]='Runtime Error' OR [status]='Wrong Answer' OR [status]='Accepted'),
    FOREIGN KEY ([submission_id]) REFERENCES [dbo].[Submission] ([submission_id]) ON DELETE CASCADE,
    FOREIGN KEY ([testcase_id]) REFERENCES [dbo].[Problem_TestCase] ([testcase_id]) ON DELETE CASCADE
);


GO

CREATE TABLE [dbo].[GroupCalls] (
    [GroupCallID]   INT           IDENTITY (1, 1) NOT NULL,
    [CallStartTime] DATETIME      DEFAULT (getdate()) NULL,
    [CallEndTime]   DATETIME      NULL,
    [CallStatus]    NVARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([GroupCallID] ASC)
);


GO

CREATE TABLE [dbo].[Likes] (
    [LikeID]   INT      IDENTITY (1, 1) NOT NULL,
    [Blog_ID]  INT      NOT NULL,
    [UserID]   INT      NOT NULL,
    [LikeDate] DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([LikeID] ASC),
    CONSTRAINT [FK_Blog_Likes] FOREIGN KEY ([Blog_ID]) REFERENCES [dbo].[Blog] ([blog_id]),
    CONSTRAINT [FK_User_Likes] FOREIGN KEY ([UserID]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[User_Role] (
    [user_role_id] INT          IDENTITY (1, 1) NOT NULL,
    [user_id]      INT          NOT NULL,
    [role]         VARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([user_role_id] ASC),
    CHECK ([role]='student' OR [role]='teacher' OR [role]='admin'),
    CONSTRAINT [chk_role] CHECK ([role]='admin' OR [role]='teacher' OR [role]='student'),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Notifications] (
    [notification_id] INT      IDENTITY (1, 1) NOT NULL,
    [course_id]       INT      NOT NULL,
    [sender_id]       INT      NOT NULL,
    [message]         TEXT     NOT NULL,
    [created_at]      DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([notification_id] ASC),
    FOREIGN KEY ([course_id]) REFERENCES [dbo].[Course] ([course_id]),
    FOREIGN KEY ([sender_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Groups] (
    [group_id]   INT           IDENTITY (1, 1) NOT NULL,
    [group_name] VARCHAR (255) NOT NULL,
    [created_at] DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([group_id] ASC)
);


GO

CREATE TABLE [dbo].[Match] (
    [match_id]   INT          IDENTITY (1, 1) NOT NULL,
    [match_date] DATETIME     NOT NULL,
    [status]     VARCHAR (50) NOT NULL,
    [created_at] DATETIME     DEFAULT (getdate()) NULL,
    [updated_at] DATETIME     DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([match_id] ASC),
    CHECK ([status]='Completed' OR [status]='Ongoing' OR [status]='Pending')
);


GO

CREATE TABLE [dbo].[Category] (
    [category_id] INT           IDENTITY (1, 1) NOT NULL,
    [title]       VARCHAR (255) NOT NULL,
    [about]       TEXT          NULL,
    [created_at]  DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([category_id] ASC)
);


GO

CREATE TABLE [dbo].[Badge] (
    [badge_id]    INT           IDENTITY (1, 1) NOT NULL,
    [title]       VARCHAR (255) NOT NULL,
    [description] TEXT          NULL,
    [created_at]  DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([badge_id] ASC)
);


GO

CREATE TABLE [dbo].[GroupMembers] (
    [group_member_id] INT IDENTITY (1, 1) NOT NULL,
    [group_id]        INT NOT NULL,
    [user_id]         INT NOT NULL,
    PRIMARY KEY CLUSTERED ([group_member_id] ASC),
    FOREIGN KEY ([group_id]) REFERENCES [dbo].[Groups] ([group_id]) ON DELETE CASCADE,
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id]) ON DELETE CASCADE,
    CONSTRAINT [unique_group_user] UNIQUE NONCLUSTERED ([group_id] ASC, [user_id] ASC)
);


GO

CREATE TABLE [dbo].[User_Badge] (
    [user_badge_id] INT      IDENTITY (1, 1) NOT NULL,
    [user_id]       INT      NOT NULL,
    [badge_id]      INT      NOT NULL,
    [awarded_at]    DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([user_badge_id] ASC),
    FOREIGN KEY ([badge_id]) REFERENCES [dbo].[Badge] ([badge_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Problem_Language] (
    [problem_id] INT          NOT NULL,
    [language]   VARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([problem_id] ASC, [language] ASC),
    CHECK ([language]='HTML/CSS' OR [language]='PHP' OR [language]='Swift' OR [language]='Go' OR [language]='JavaScript' OR [language]='C#' OR [language]='C++' OR [language]='C' OR [language]='Java' OR [language]='Python'),
    FOREIGN KEY ([problem_id]) REFERENCES [dbo].[Problem] ([problem_id]) ON DELETE CASCADE
);


GO

CREATE TABLE [dbo].[Problem_TestCase] (
    [testcase_id]     INT      IDENTITY (1, 1) NOT NULL,
    [problem_id]      INT      NOT NULL,
    [input_data]      TEXT     NOT NULL,
    [expected_output] TEXT     NOT NULL,
    [created_at]      DATETIME DEFAULT (getdate()) NULL,
    [points]          INT      DEFAULT ((1)) NOT NULL,
    PRIMARY KEY CLUSTERED ([testcase_id] ASC),
    FOREIGN KEY ([problem_id]) REFERENCES [dbo].[Problem] ([problem_id]) ON DELETE CASCADE
);


GO

CREATE TABLE [dbo].[QnA] (
    [question_id] INT      IDENTITY (1, 1) NOT NULL,
    [user_id]     INT      NOT NULL,
    [question]    TEXT     NOT NULL,
    [answer]      TEXT     NULL,
    [created_at]  DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([question_id] ASC),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Audit_Log] (
    [log_id]     INT           IDENTITY (1, 1) NOT NULL,
    [table_name] VARCHAR (255) NOT NULL,
    [action]     VARCHAR (50)  NOT NULL,
    [user_id]    INT           NOT NULL,
    [timestamp]  DATETIME      DEFAULT (getdate()) NOT NULL,
    [changes]    TEXT          NULL,
    PRIMARY KEY CLUSTERED ([log_id] ASC),
    CONSTRAINT [FK_Audit_User] FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id]),
    CONSTRAINT [UQ_User_Table_Action] UNIQUE NONCLUSTERED ([user_id] ASC, [table_name] ASC, [action] ASC, [timestamp] ASC)
);


GO

CREATE TABLE [dbo].[Class_Student] (
    [class_id]   INT      NOT NULL,
    [student_id] INT      NOT NULL,
    [joined_at]  DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([class_id] ASC, [student_id] ASC),
    FOREIGN KEY ([class_id]) REFERENCES [dbo].[Class] ([class_id]),
    FOREIGN KEY ([student_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Learning_Progress] (
    [progress_id]         INT          IDENTITY (1, 1) NOT NULL,
    [user_id]             INT          NOT NULL,
    [course_id]           INT          NOT NULL,
    [problem_id]          INT          NULL,
    [status]              VARCHAR (50) NOT NULL,
    [progress_percentage] INT          NOT NULL,
    [updated_at]          DATETIME     DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([progress_id] ASC),
    CHECK ([progress_percentage]>=(0) AND [progress_percentage]<=(100)),
    FOREIGN KEY ([course_id]) REFERENCES [dbo].[Course] ([course_id]),
    FOREIGN KEY ([problem_id]) REFERENCES [dbo].[Problem] ([problem_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE NONCLUSTERED INDEX [idx_class_teacher]
    ON [dbo].[Class]([teacher_id] ASC);


GO

CREATE NONCLUSTERED INDEX [idx_problem_id]
    ON [dbo].[Submission]([problem_id] ASC);


GO

CREATE NONCLUSTERED INDEX [idx_comment_user_problem]
    ON [dbo].[Comment]([user_id] ASC, [problem_id] ASC);


GO

CREATE NONCLUSTERED INDEX [idx_match_user]
    ON [dbo].[Match_User]([match_id] ASC, [user_id] ASC);


GO

CREATE NONCLUSTERED INDEX [idx_problem_id]
    ON [dbo].[Problem_TestCase]([problem_id] ASC);


GO

CREATE NONCLUSTERED INDEX [idx_user_id]
    ON [dbo].[Submission]([user_id] ASC);


GO

CREATE NONCLUSTERED INDEX [idx_user_course]
    ON [dbo].[Ratings]([user_id] ASC, [course_id] ASC);


GO

CREATE NONCLUSTERED INDEX [idx_user_id]
    ON [dbo].[Error_Report]([user_id] ASC);


GO

CREATE NONCLUSTERED INDEX [idx_class_student]
    ON [dbo].[Class_Student]([class_id] ASC, [student_id] ASC);


GO

CREATE NONCLUSTERED INDEX [idx_user_problem]
    ON [dbo].[Submission]([user_id] ASC, [problem_id] ASC);


GO

CREATE COLUMNSTORE INDEX [idx_submission_columnstore]
    ON [dbo].[Submission]([score], [runtime], [memory_used]);


GO

CREATE PROCEDURE [dbo].[GetUserSubmissions]
    @user_id INT
AS
BEGIN
    SELECT submission_id, problem_id, status, score, submitted_at
    FROM [dbo].[Submission]
    WHERE user_id = @user_id;
END;

GO

CREATE TABLE [dbo].[Stories] (
    [story_id] INT IDENTITY(1,1) NOT NULL,
    [user_id] INT NOT NULL,
    [content] TEXT NULL,
    [media_url] NVARCHAR(255) NULL,
    [created_at] DATETIME DEFAULT(GETDATE()),
    [expires_at] DATETIME,
    PRIMARY KEY CLUSTERED ([story_id] ASC),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);

CREATE TABLE [dbo].[Chat_Room] (
    [room_id] INT IDENTITY(1,1) NOT NULL,
    [name] NVARCHAR(100) NULL,
    [is_group_chat] BIT DEFAULT(0),
    [created_at] DATETIME DEFAULT(GETDATE()),
    PRIMARY KEY CLUSTERED ([room_id] ASC)
);

CREATE TABLE [dbo].[Chat_Room_Member] (
    [room_id] INT NOT NULL,
    [user_id] INT NOT NULL,
    [joined_at] DATETIME DEFAULT(GETDATE()),
    PRIMARY KEY ([room_id], [user_id]),
    FOREIGN KEY ([room_id]) REFERENCES [dbo].[Chat_Room] ([room_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);

CREATE TABLE [dbo].[Video_Call] (
    [call_id] INT IDENTITY(1,1) NOT NULL,
    [caller_id] INT NOT NULL,
    [receiver_id] INT NOT NULL,
    [start_time] DATETIME DEFAULT(GETDATE()),
    [end_time] DATETIME NULL,
    [call_type] VARCHAR(20) CHECK (call_type IN ('audio', 'video')),
    [status] VARCHAR(20) CHECK (status IN ('ongoing', 'completed', 'missed')),
    PRIMARY KEY CLUSTERED ([call_id] ASC),
    FOREIGN KEY ([caller_id]) REFERENCES [dbo].[User] ([user_id]),
    FOREIGN KEY ([receiver_id]) REFERENCES [dbo].[User] ([user_id])
);

CREATE TABLE [dbo].[AI_Chat_History] (
    [chat_id] INT IDENTITY(1,1) NOT NULL,
    [user_id] INT NOT NULL,
    [user_message] TEXT NOT NULL,
    [ai_response] TEXT NOT NULL,
    [created_at] DATETIME DEFAULT(GETDATE()),
    PRIMARY KEY CLUSTERED ([chat_id] ASC),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);

CREATE TABLE [dbo].[User_Status] (
    [status_id] INT IDENTITY(1,1) NOT NULL,
    [user_id] INT NOT NULL,
    [status_text] NVARCHAR(500) NULL,
    [status_type] VARCHAR(20) CHECK (status_type IN ('text', 'image', 'video')),
    [media_url] NVARCHAR(255) NULL,
    [created_at] DATETIME DEFAULT(GETDATE()),
    [expires_at] DATETIME NULL,
    PRIMARY KEY CLUSTERED ([status_id] ASC),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);

CREATE TABLE [dbo].[Overall_Ranking] (
    [ranking_id] INT IDENTITY(1,1) NOT NULL,
    [user_id] INT NOT NULL,
    [total_points] INT DEFAULT(0),
    [contest_wins] INT DEFAULT(0),
    [problem_solved] INT DEFAULT(0),
    [rank_level] VARCHAR(20) CHECK (rank_level IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
    [updated_at] DATETIME DEFAULT(GETDATE()),
    PRIMARY KEY CLUSTERED ([ranking_id] ASC),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);

