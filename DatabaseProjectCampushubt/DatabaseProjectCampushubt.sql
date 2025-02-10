drop database campushubt;
GO

CREATE TABLE [dbo].[Users] (
    [UserID] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [Username] VARCHAR(50) UNIQUE NOT NULL,
    [Email] VARCHAR(100) UNIQUE NOT NULL,
    [Password] VARCHAR(255),
    [FullName] VARCHAR(100),
    [Image] VARCHAR(255),
    [CoverImage] VARCHAR(255),
    [Bio] TEXT,
    [Role] VARCHAR(20) DEFAULT 'STUDENT' CHECK (Role IN ('ADMIN', 'TEACHER', 'STUDENT')),
    [Status] VARCHAR(20) DEFAULT 'OFFLINE' CHECK (Status IN ('ONLINE', 'OFFLINE', 'AWAY')),
    [AccountStatus] VARCHAR(20) DEFAULT 'ACTIVE' CHECK (AccountStatus IN ('ACTIVE', 'SUSPENDED', 'BANNED')),
    [Provider] VARCHAR(20) DEFAULT 'local',
    [GoogleID] VARCHAR(100),
    [ResetToken] VARCHAR(255),
    [ResetTokenExpiry] DATETIME,
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    [LastLogin] DATETIME,
    [LastLogout] DATETIME,
    [IsDeleted] BIT DEFAULT 0
);
GO

CREATE TABLE [dbo].[GroupCallParticipants] (
    [ParticipantID] INT IDENTITY (1, 1) NOT NULL,
    [GroupCallID]   INT NOT NULL,
    [UserID]        BIGINT NOT NULL,
    PRIMARY KEY CLUSTERED ([ParticipantID] ASC),
    CONSTRAINT [FK_GroupCall] FOREIGN KEY ([GroupCallID]) REFERENCES [dbo].[GroupCalls] ([GroupCallID]) ON DELETE CASCADE,
    CONSTRAINT [FK_User_GroupCall] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Messages] (
    [MessageID] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [RoomID] BIGINT NOT NULL,
    [SenderID] BIGINT NOT NULL,
    [Type] VARCHAR(20) CHECK (Type IN ('TEXT', 'IMAGE', 'VIDEO', 'FILE')),
    [Content] TEXT,
    [MediaUrl] VARCHAR(255),
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    [UpdatedAt] DATETIME,
    [IsDeleted] BIT DEFAULT 0,
    FOREIGN KEY ([RoomID]) REFERENCES [dbo].[ChatRooms] ([RoomID]),
    FOREIGN KEY ([SenderID]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Match_User] (
    [match_user_id] INT IDENTITY (1, 1) NOT NULL,
    [match_id]      INT NOT NULL,
    [user_id]       BIGINT NOT NULL,
    [score]         INT NULL,
    [rank_position] INT NULL,
    PRIMARY KEY CLUSTERED ([match_user_id] ASC),
    CHECK ([rank_position]>=(0)),
    CHECK ([score]>=(0)),
    FOREIGN KEY ([match_id]) REFERENCES [dbo].[Match] ([match_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Ratings] (
    [rating_id] INT      IDENTITY (1, 1) NOT NULL,
    [user_id]   BIGINT   NOT NULL,
    [course_id] INT      NOT NULL,
    [rating]    INT      NOT NULL,
    [comment]   TEXT     NULL,
    [rated_at]  DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([rating_id] ASC),
    CHECK ([rating]>=(1) AND [rating]<=(5)),
    FOREIGN KEY ([course_id]) REFERENCES [dbo].[Course] ([course_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Admin] (
    [admin_id]     INT      IDENTITY (1, 1) NOT NULL,
    [user_id]      BIGINT   NOT NULL,
    [access_level] INT      NOT NULL,
    [created_at]   DATETIME DEFAULT (getdate()) NULL,
    [updated_at]   DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([admin_id] ASC),
    CHECK ([access_level]>=(1) AND [access_level]<=(10)),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Shares] (
    [ShareID]   INT      IDENTITY (1, 1) NOT NULL,
    [Blog_ID]   INT      NOT NULL,
    [UserID]    BIGINT   NOT NULL,
    [ShareDate] DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([ShareID] ASC),
    CONSTRAINT [FK_Blog_Shares] FOREIGN KEY ([Blog_ID]) REFERENCES [dbo].[Blog] ([blog_id]),
    CONSTRAINT [FK_User_Shares] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Comment] (
    [comment_id] INT      IDENTITY (1, 1) NOT NULL,
    [user_id]    BIGINT   NOT NULL,
    [problem_id] INT      NOT NULL,
    [content]    TEXT     NOT NULL,
    [created_at] DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([comment_id] ASC),
    FOREIGN KEY ([problem_id]) REFERENCES [dbo].[Problem] ([problem_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Blog] (
    [blog_id]    INT           IDENTITY (1, 1) NOT NULL,
    [author_id]  BIGINT        NOT NULL,
    [title]      VARCHAR (255) NOT NULL,
    [content]    TEXT          NOT NULL,
    [created_at] DATETIME      DEFAULT (getdate()) NULL,
    [status] VARCHAR(20) DEFAULT('public') CHECK (status IN ('public', 'private', 'draft')),
    [post_type] VARCHAR(20) DEFAULT('normal') CHECK (post_type IN ('normal', 'announcement', 'event')),
    PRIMARY KEY CLUSTERED ([blog_id] ASC),
    FOREIGN KEY ([author_id]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Rank] (
    [rank_id]        INT            IDENTITY (1, 1) NOT NULL,
    [user_id]        BIGINT         NOT NULL,
    [category_id]    INT            NOT NULL,
    [total_score]    INT            NULL,
    [detailed_score] NVARCHAR (MAX) NULL,
    [rank_position]  INT            NULL,
    [updated_at]     DATETIME       DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([rank_id] ASC),
    CHECK ([rank_position]>=(0)),
    CHECK ([total_score]>=(0)),
    FOREIGN KEY ([category_id]) REFERENCES [dbo].[Category] ([category_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Submission] (
    [submission_id] INT          IDENTITY (1, 1) NOT NULL,
    [user_id]       BIGINT       NOT NULL,
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
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID]),
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
    [creator_id]  BIGINT        NOT NULL,
    [created_at]  DATETIME      DEFAULT (getdate()) NULL,
    [updated_at]  DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([course_id] ASC),
    FOREIGN KEY ([creator_id]) REFERENCES [dbo].[Users] ([UserID]) ON DELETE CASCADE
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
    [manager_user_id] BIGINT   NOT NULL,
    [student_user_id] BIGINT   NOT NULL,
    [problem_id]      INT      NOT NULL,
    [assigned_at]     DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([manager_id] ASC),
    FOREIGN KEY ([manager_user_id]) REFERENCES [dbo].[Users] ([UserID]),
    FOREIGN KEY ([problem_id]) REFERENCES [dbo].[Problem] ([problem_id]),
    FOREIGN KEY ([student_user_id]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Match_Rank] (
    [rank_id]       INT      IDENTITY (1, 1) NOT NULL,
    [match_id]      INT      NOT NULL,
    [user_id]       BIGINT   NOT NULL,
    [total_score]   INT      NULL,
    [rank_position] INT      NULL,
    [created_at]    DATETIME DEFAULT (getdate()) NULL,
    [updated_at]    DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([rank_id] ASC),
    CHECK ([rank_position]>=(0)),
    CHECK ([total_score]>=(0)),
    FOREIGN KEY ([match_id]) REFERENCES [dbo].[Match] ([match_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Class] (
    [class_id]   INT           IDENTITY (1, 1) NOT NULL,
    [class_name] VARCHAR (255) NOT NULL,
    [teacher_id] BIGINT        NOT NULL,
    [created_at] DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([class_id] ASC),
    FOREIGN KEY ([teacher_id]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Admin_Activity] (
    [activity_id] INT           IDENTITY (1, 1) NOT NULL,
    [admin_id]    BIGINT        NOT NULL,
    [action]      VARCHAR (255) NOT NULL,
    [target_type] VARCHAR (50)  NOT NULL,
    [target_id]   INT           NULL,
    [timestamp]   DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([activity_id] ASC),
    CHECK ([target_type]='Course' OR [target_type]='Problem' OR [target_type]='User'),
    FOREIGN KEY ([admin_id]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Blog_Comment] (
    [comment_id] INT          IDENTITY (1, 1) NOT NULL,
    [blog_id]    INT          NOT NULL,
    [user_id]    BIGINT       NOT NULL,
    [content]    TEXT         NOT NULL,
    [rank_flag]  VARCHAR (50) NULL,
    [created_at] DATETIME     DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([comment_id] ASC),
    FOREIGN KEY ([blog_id]) REFERENCES [dbo].[Blog] ([blog_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Error_Report] (
    [report_id]     INT      IDENTITY (1, 1) NOT NULL,
    [user_id]       BIGINT   NOT NULL,
    [error_message] TEXT     NOT NULL,
    [created_at]    DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([report_id] ASC),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Course_Student] (
    [course_id]  INT          NOT NULL,
    [student_id] BIGINT       NOT NULL,
    [joined_at]  DATETIME     DEFAULT (getdate()) NULL,
    [role]       VARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([course_id] ASC, [student_id] ASC),
    CHECK ([role]='student' OR [role]='instructor'),
    FOREIGN KEY ([course_id]) REFERENCES [dbo].[Course] ([course_id]),
    FOREIGN KEY ([student_id]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[PasswordReset] (
    [reset_id]    INT           IDENTITY (1, 1) NOT NULL,
    [user_id]     BIGINT        NOT NULL,
    [reset_token] VARCHAR (255) NOT NULL,
    [created_at]  DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([reset_id] ASC),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID])
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
    [LikeID] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [UserID] BIGINT NOT NULL,
    [PostID] BIGINT,
    [CommentID] BIGINT,
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID]),
    FOREIGN KEY ([PostID]) REFERENCES [dbo].[Posts] ([PostID]),
    FOREIGN KEY ([CommentID]) REFERENCES [dbo].[Comments] ([CommentID]),
    CONSTRAINT UQ_UserPost UNIQUE ([UserID], [PostID]),
    CONSTRAINT UQ_UserComment UNIQUE ([UserID], [CommentID])
);
GO

CREATE TABLE [dbo].[User_Role] (
    [user_role_id] INT          IDENTITY (1, 1) NOT NULL,
    [user_id]      BIGINT       NOT NULL,
    [role]         VARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([user_role_id] ASC),
    CHECK ([role]='student' OR [role]='teacher' OR [role]='admin'),
    CONSTRAINT [chk_role] CHECK ([role]='admin' OR [role]='teacher' OR [role]='student'),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Notifications] (
    [notification_id] INT      IDENTITY (1, 1) NOT NULL,
    [course_id]       INT      NOT NULL,
    [sender_id]       BIGINT   NOT NULL,
    [message]         TEXT     NOT NULL,
    [created_at]      DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([notification_id] ASC),
    FOREIGN KEY ([course_id]) REFERENCES [dbo].[Course] ([course_id]),
    FOREIGN KEY ([sender_id]) REFERENCES [dbo].[Users] ([UserID])
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
    [user_id]         BIGINT NOT NULL,
    PRIMARY KEY CLUSTERED ([group_member_id] ASC),
    FOREIGN KEY ([group_id]) REFERENCES [dbo].[Groups] ([group_id]) ON DELETE CASCADE,
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID]) ON DELETE CASCADE,
    CONSTRAINT [unique_group_user] UNIQUE NONCLUSTERED ([group_id] ASC, [user_id] ASC)
);
GO

CREATE TABLE [dbo].[User_Badge] (
    [user_badge_id] INT      IDENTITY (1, 1) NOT NULL,
    [user_id]       BIGINT   NOT NULL,
    [badge_id]      INT      NOT NULL,
    [awarded_at]    DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([user_badge_id] ASC),
    FOREIGN KEY ([badge_id]) REFERENCES [dbo].[Badge] ([badge_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID])
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
    [user_id]     BIGINT   NOT NULL,
    [question]    TEXT     NOT NULL,
    [answer]      TEXT     NULL,
    [created_at]  DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([question_id] ASC),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Audit_Log] (
    [log_id]     INT           IDENTITY (1, 1) NOT NULL,
    [table_name] VARCHAR (255) NOT NULL,
    [action]     VARCHAR (50)  NOT NULL,
    [user_id]    BIGINT        NOT NULL,
    [timestamp]  DATETIME      DEFAULT (getdate()) NOT NULL,
    [changes]    TEXT          NULL,
    PRIMARY KEY CLUSTERED ([log_id] ASC),
    CONSTRAINT [FK_Audit_User] FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID]),
    CONSTRAINT [UQ_User_Table_Action] UNIQUE NONCLUSTERED ([user_id] ASC, [table_name] ASC, [action] ASC, [timestamp] ASC)
);
GO

CREATE TABLE [dbo].[Class_Student] (
    [class_id]   INT      NOT NULL,
    [student_id] BIGINT   NOT NULL,
    [joined_at]  DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([class_id] ASC, [student_id] ASC),
    FOREIGN KEY ([class_id]) REFERENCES [dbo].[Class] ([class_id]),
    FOREIGN KEY ([student_id]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Learning_Progress] (
    [progress_id]         INT          IDENTITY (1, 1) NOT NULL,
    [user_id]             BIGINT       NOT NULL,
    [course_id]           INT          NOT NULL,
    [problem_id]          INT          NULL,
    [status]              VARCHAR (50) NOT NULL,
    [progress_percentage] INT          NOT NULL,
    [updated_at]          DATETIME     DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([progress_id] ASC),
    CHECK ([progress_percentage]>=(0) AND [progress_percentage]<=(100)),
    FOREIGN KEY ([course_id]) REFERENCES [dbo].[Course] ([course_id]),
    FOREIGN KEY ([problem_id]) REFERENCES [dbo].[Problem] ([problem_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Posts] (
    [PostID] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [UserID] BIGINT NOT NULL,
    [Type] VARCHAR(20) CHECK (Type IN ('NORMAL', 'ANNOUNCEMENT', 'EVENT')),
    [Content] TEXT,
    [MediaUrl] VARCHAR(255),
    [Privacy] VARCHAR(20) DEFAULT 'PUBLIC' CHECK (Privacy IN ('PUBLIC', 'PRIVATE', 'DRAFT')),
    [LikesCount] INT DEFAULT 0,
    [CommentsCount] INT DEFAULT 0,
    [SharesCount] INT DEFAULT 0,
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    [UpdatedAt] DATETIME,
    [IsDeleted] BIT DEFAULT 0,
    FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Comments] (
    [CommentID] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [PostID] BIGINT NOT NULL,
    [UserID] BIGINT NOT NULL,
    [ParentCommentID] BIGINT,
    [Content] TEXT NOT NULL,
    [LikesCount] INT DEFAULT 0,
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    [UpdatedAt] DATETIME,
    [IsDeleted] BIT DEFAULT 0,
    FOREIGN KEY ([PostID]) REFERENCES [dbo].[Posts] ([PostID]),
    FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID]),
    FOREIGN KEY ([ParentCommentID]) REFERENCES [dbo].[Comments] ([CommentID])
);
GO

CREATE TABLE [dbo].[Follows] (
    [FollowID] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [FollowerID] BIGINT NOT NULL,
    [FollowingID] BIGINT NOT NULL,
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([FollowerID]) REFERENCES [dbo].[Users] ([UserID]),
    FOREIGN KEY ([FollowingID]) REFERENCES [dbo].[Users] ([UserID]),
    CONSTRAINT UQ_Follower_Following UNIQUE ([FollowerID], [FollowingID])
);
GO

CREATE TABLE [dbo].[ChatRooms] (
    [RoomID] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [Type] VARCHAR(20) CHECK (Type IN ('ONE_TO_ONE', 'GROUP')),
    [Name] VARCHAR(100),
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    [LastActivityAt] DATETIME,
    [CreatedBy] BIGINT,
    FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[ChatRoomMembers] (
    [RoomID] BIGINT,
    [UserID] BIGINT,
    [Role] VARCHAR(20) DEFAULT 'MEMBER' CHECK (Role IN ('ADMIN', 'MEMBER')),
    [JoinedAt] DATETIME DEFAULT GETDATE(),
    [LastReadAt] DATETIME,
    PRIMARY KEY ([RoomID], [UserID]),
    FOREIGN KEY ([RoomID]) REFERENCES [dbo].[ChatRooms] ([RoomID]),
    FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Calls] (
    [CallID] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [RoomID] BIGINT NOT NULL,
    [InitiatorID] BIGINT NOT NULL,
    [Type] VARCHAR(20) CHECK (Type IN ('AUDIO', 'VIDEO')),
    [Status] VARCHAR(20) CHECK (Status IN ('ONGOING', 'COMPLETED', 'MISSED')),
    [StartTime] DATETIME DEFAULT GETDATE(),
    [EndTime] DATETIME,
    [Duration] INT,
    FOREIGN KEY ([RoomID]) REFERENCES [dbo].[ChatRooms] ([RoomID]),
    FOREIGN KEY ([InitiatorID]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[UserRankings] (
    [RankingID] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [UserID] BIGINT NOT NULL,
    [TotalScore] INT DEFAULT 0,
    [ContestWins] INT DEFAULT 0,
    [ProblemsSolved] INT DEFAULT 0,
    [Tier] VARCHAR(20) CHECK (Tier IN ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND')),
    [UpdatedAt] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[Achievements] (
    [AchievementID] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [Name] VARCHAR(100) NOT NULL,
    [Description] TEXT,
    [BadgeUrl] VARCHAR(255),
    [Category] VARCHAR(50),
    [RequiredScore] INT
);
GO

CREATE TABLE [dbo].[UserAchievements] (
    [UserID] BIGINT,
    [AchievementID] BIGINT,
    [EarnedAt] DATETIME DEFAULT GETDATE(),
    [Progress] INT DEFAULT 0,
    PRIMARY KEY ([UserID], [AchievementID]),
    FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID]),
    FOREIGN KEY ([AchievementID]) REFERENCES [dbo].[Achievements] ([AchievementID])
);

-- AI Chat Support
CREATE TABLE [dbo].[AIChatSessions] (
    [SessionID] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [UserID] BIGINT NOT NULL,
    [Context] TEXT,
    [Status] VARCHAR(20) CHECK (Status IN ('ACTIVE', 'COMPLETED', 'FAILED')),
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    [LastMessageAt] DATETIME,
    FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID])
);

CREATE TABLE [dbo].[AIChatMessages] (
    [MessageID] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [SessionID] BIGINT NOT NULL,
    [Role] VARCHAR(20) CHECK (Role IN ('USER', 'ASSISTANT')),
    [Content] TEXT NOT NULL,
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    [Feedback] VARCHAR(20) CHECK (Feedback IN ('HELPFUL', 'NOT_HELPFUL', NULL)),
    FOREIGN KEY ([SessionID]) REFERENCES [dbo].[AIChatSessions] ([SessionID])
);

-- Create indexes for better performance
CREATE NONCLUSTERED INDEX [IX_Posts_CreatedAt] ON [dbo].[Posts] ([CreatedAt] DESC);
CREATE NONCLUSTERED INDEX [IX_Stories_ExpiresAt] ON [dbo].[Stories] ([ExpiresAt]);
CREATE NONCLUSTERED INDEX [IX_Messages_RoomID_CreatedAt] ON [dbo].[Messages] ([RoomID], [CreatedAt] DESC);
CREATE NONCLUSTERED INDEX [IX_UserRankings_TotalScore] ON [dbo].[UserRankings] ([TotalScore] DESC);

CREATE TABLE [dbo].[Stories] (
    [StoryID] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [UserID] BIGINT NOT NULL,
    [Type] VARCHAR(20) CHECK (Type IN ('TEXT', 'IMAGE', 'VIDEO')),
    [Content] TEXT,
    [MediaUrl] VARCHAR(255),
    [ViewsCount] INT DEFAULT 0,
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    [ExpiresAt] DATETIME,
    [IsDeleted] BIT DEFAULT 0,
    FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID])
);
GO

CREATE TABLE [dbo].[StoryViews] (
    [ViewID] BIGINT IDENTITY(1,1) PRIMARY KEY, 
    [StoryID] BIGINT NOT NULL,
    [ViewerID] BIGINT NOT NULL,
    [ViewedAt] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([StoryID]) REFERENCES [dbo].[Stories] ([StoryID]),
    FOREIGN KEY ([ViewerID]) REFERENCES [dbo].[Users] ([UserID])
);
GO

-- Add Type column to Posts table if not exists
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Posts' 
    AND COLUMN_NAME = 'Type'
)
BEGIN
    ALTER TABLE [dbo].[Posts]
    ADD [Type] VARCHAR(20) CHECK (Type IN ('TEXT', 'IMAGE', 'VIDEO'));
END
GO

-- Create indexes for Stories
CREATE NONCLUSTERED INDEX [IX_Stories_UserID] ON [dbo].[Stories] ([UserID]);
CREATE NONCLUSTERED INDEX [IX_StoryViews_StoryID] ON [dbo].[StoryViews] ([StoryID]);
GO
