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

CREATE TABLE [dbo].[ChatRoomMembers] (
    [RoomID]     BIGINT       NOT NULL,
    [UserID]     BIGINT       NOT NULL,
    [Role]       VARCHAR (20) DEFAULT ('MEMBER') NULL,
    [JoinedAt]   DATETIME     DEFAULT (getdate()) NULL,
    [LastReadAt] DATETIME     NULL,
    PRIMARY KEY CLUSTERED ([RoomID] ASC, [UserID] ASC),
    CHECK ([Role]='MEMBER' OR [Role]='ADMIN'),
    FOREIGN KEY ([RoomID]) REFERENCES [dbo].[ChatRooms] ([RoomID]),
    FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID])
);


GO

CREATE TABLE [dbo].[Submissions] (
    [submission_id] BIGINT        IDENTITY (1, 1) NOT NULL,
    [problem_id]    BIGINT        NULL,
    [score]         INT           NULL,
    [status]        VARCHAR (255) NULL,
    [submitted_at]  DATETIME2 (6) NULL,
    [user_id]       BIGINT        NULL,
    PRIMARY KEY CLUSTERED ([submission_id] ASC)
);


GO

CREATE TABLE [dbo].[Posts] (
    [PostID]        BIGINT             IDENTITY (1, 1) NOT NULL,
    [UserID]        BIGINT             NOT NULL,
    [Type]          VARCHAR (20)       NULL,
    [Content]       VARCHAR (MAX)      NULL,
    [MediaUrl]      VARCHAR (255)      NULL,
    [Privacy]       VARCHAR (20)       DEFAULT ('PUBLIC') NULL,
    [LikesCount]    INT                DEFAULT ((0)) NULL,
    [CommentsCount] INT                DEFAULT ((0)) NULL,
    [SharesCount]   INT                DEFAULT ((0)) NULL,
    [CreatedAt]     DATETIME           DEFAULT (getdate()) NULL,
    [UpdatedAt]     DATETIMEOFFSET (6) NULL,
    [IsDeleted]     BIT                DEFAULT ((0)) NULL,
    PRIMARY KEY CLUSTERED ([PostID] ASC),
    CHECK ([Privacy]='DRAFT' OR [Privacy]='PRIVATE' OR [Privacy]='PUBLIC'),
    CHECK ([Type]='EVENT' OR [Type]='ANNOUNCEMENT' OR [Type]='NORMAL'),
    FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID])
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

CREATE TABLE [dbo].[UserRankings] (
    [RankingID]      BIGINT       IDENTITY (1, 1) NOT NULL,
    [UserID]         BIGINT       NOT NULL,
    [TotalScore]     INT          DEFAULT ((0)) NULL,
    [ProblemsSolved] INT          DEFAULT ((0)) NULL,
    [ContestWins]    INT          DEFAULT ((0)) NULL,
    [AccuracyRate]   FLOAT (53)   DEFAULT ((0)) NULL,
    [LastUpdated]    DATETIME     DEFAULT (getdate()) NULL,
    [RankTier]       VARCHAR (20) DEFAULT ('BRONZE') NULL,
    [MonthlyScore]   INT          DEFAULT ((0)) NULL,
    [WeeklyScore]    INT          DEFAULT ((0)) NULL,
    [CategoryID]     INT          DEFAULT ((1)) NULL,
    PRIMARY KEY CLUSTERED ([RankingID] ASC),
    FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID])
);


GO

CREATE TABLE [dbo].[ChatRooms] (
    [RoomID]         BIGINT        IDENTITY (1, 1) NOT NULL,
    [Type]           VARCHAR (20)  NULL,
    [Name]           VARCHAR (100) NULL,
    [CreatedAt]      DATETIME      DEFAULT (getdate()) NULL,
    [LastActivityAt] DATETIME      NULL,
    [CreatedBy]      BIGINT        NULL,
    PRIMARY KEY CLUSTERED ([RoomID] ASC),
    CHECK ([Type]='GROUP' OR [Type]='ONE_TO_ONE'),
    FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[Users] ([UserID])
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

CREATE TABLE [dbo].[Messages] (
    [MessageID] BIGINT        IDENTITY (1, 1) NOT NULL,
    [RoomID]    BIGINT        NOT NULL,
    [SenderID]  BIGINT        NOT NULL,
    [Type]      VARCHAR (20)  NULL,
    [Content]   TEXT          NULL,
    [MediaUrl]  VARCHAR (255) NULL,
    [CreatedAt] DATETIME      DEFAULT (getdate()) NULL,
    [UpdatedAt] DATETIME      NULL,
    [IsDeleted] BIT           DEFAULT ((0)) NULL,
    PRIMARY KEY CLUSTERED ([MessageID] ASC),
    CHECK ([Type]='FILE' OR [Type]='VIDEO' OR [Type]='IMAGE' OR [Type]='TEXT'),
    FOREIGN KEY ([RoomID]) REFERENCES [dbo].[ChatRooms] ([RoomID]),
    FOREIGN KEY ([SenderID]) REFERENCES [dbo].[Users] ([UserID])
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

CREATE TABLE [dbo].[GroupCallParticipants] (
    [ParticipantID] INT    IDENTITY (1, 1) NOT NULL,
    [GroupCallID]   INT    NOT NULL,
    [UserID]        BIGINT NOT NULL,
    PRIMARY KEY CLUSTERED ([ParticipantID] ASC),
    CONSTRAINT [FK_GroupCall] FOREIGN KEY ([GroupCallID]) REFERENCES [dbo].[GroupCalls] ([GroupCallID]) ON DELETE CASCADE,
    CONSTRAINT [FK_User_GroupCall] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID])
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

CREATE TABLE [dbo].[AIChatMessages] (
    [MessageID] BIGINT       IDENTITY (1, 1) NOT NULL,
    [SessionID] BIGINT       NOT NULL,
    [Role]      VARCHAR (20) NULL,
    [Content]   TEXT         NOT NULL,
    [CreatedAt] DATETIME     DEFAULT (getdate()) NULL,
    [Feedback]  VARCHAR (20) NULL,
    PRIMARY KEY CLUSTERED ([MessageID] ASC),
    CHECK ([Feedback]=NULL OR [Feedback]='NOT_HELPFUL' OR [Feedback]='HELPFUL'),
    CHECK ([Role]='ASSISTANT' OR [Role]='USER'),
    FOREIGN KEY ([SessionID]) REFERENCES [dbo].[AIChatSessions] ([SessionID])
);


GO

CREATE TABLE [dbo].[Achievements] (
    [AchievementID] BIGINT        IDENTITY (1, 1) NOT NULL,
    [Name]          VARCHAR (100) NOT NULL,
    [Description]   TEXT          NULL,
    [BadgeUrl]      VARCHAR (255) NULL,
    [Category]      VARCHAR (50)  NULL,
    [RequiredScore] INT           NULL,
    PRIMARY KEY CLUSTERED ([AchievementID] ASC)
);


GO

CREATE TABLE [dbo].[GroupMembers] (
    [group_member_id] INT    IDENTITY (1, 1) NOT NULL,
    [group_id]        INT    NOT NULL,
    [user_id]         BIGINT NOT NULL,
    PRIMARY KEY CLUSTERED ([group_member_id] ASC),
    FOREIGN KEY ([group_id]) REFERENCES [dbo].[Groups] ([group_id]) ON DELETE CASCADE,
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID]) ON DELETE CASCADE,
    CONSTRAINT [unique_group_user] UNIQUE NONCLUSTERED ([group_id] ASC, [user_id] ASC)
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

CREATE TABLE [dbo].[MatchRanks] (
    [match_rank_id] BIGINT IDENTITY (1, 1) NOT NULL,
    [match_id]      BIGINT NULL,
    [rank_position] INT    NULL,
    [score]         INT    NULL,
    [user_id]       BIGINT NULL,
    PRIMARY KEY CLUSTERED ([match_rank_id] ASC)
);


GO

CREATE TABLE [dbo].[PostMedia] (
    [id]      BIGINT        IDENTITY (1, 1) NOT NULL,
    [height]  INT           NULL,
    [size]    BIGINT        NULL,
    [type]    VARCHAR (255) NULL,
    [url]     VARCHAR (255) NOT NULL,
    [width]   INT           NULL,
    [post_id] BIGINT        NULL,
    [PostID]  BIGINT        NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FKdkihk83if5ig8tnm78teborte] FOREIGN KEY ([PostID]) REFERENCES [dbo].[Posts] ([PostID]),
    CONSTRAINT [FKsx2vr55gtd221w8x6gdpw9wwv] FOREIGN KEY ([post_id]) REFERENCES [dbo].[Posts] ([PostID])
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

CREATE TABLE [dbo].[Class] (
    [class_id]   INT           IDENTITY (1, 1) NOT NULL,
    [class_name] VARCHAR (255) NOT NULL,
    [teacher_id] BIGINT        NOT NULL,
    [created_at] DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([class_id] ASC),
    FOREIGN KEY ([teacher_id]) REFERENCES [dbo].[Users] ([UserID])
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

CREATE TABLE [dbo].[Stories] (
    [StoryID]    BIGINT        IDENTITY (1, 1) NOT NULL,
    [Content]    TEXT          NULL,
    [CreatedAt]  DATETIME2 (6) NULL,
    [ExpiresAt]  DATETIME2 (6) NULL,
    [IsDeleted]  BIT           NULL,
    [MediaUrl]   VARCHAR (255) NULL,
    [Type]       VARCHAR (255) NULL,
    [ViewsCount] INT           NULL,
    [UserID]     BIGINT        NULL,
    PRIMARY KEY CLUSTERED ([StoryID] ASC),
    CONSTRAINT [FKr9p6rfi50xhr9d6d3papt6cwm] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID])
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

CREATE TABLE [dbo].[Blog] (
    [blog_id]    INT           IDENTITY (1, 1) NOT NULL,
    [author_id]  BIGINT        NOT NULL,
    [title]      VARCHAR (255) NOT NULL,
    [content]    TEXT          NOT NULL,
    [created_at] DATETIME      DEFAULT (getdate()) NULL,
    [status]     VARCHAR (20)  DEFAULT ('public') NULL,
    [post_type]  VARCHAR (20)  DEFAULT ('normal') NULL,
    PRIMARY KEY CLUSTERED ([blog_id] ASC),
    CHECK ([post_type]='event' OR [post_type]='announcement' OR [post_type]='normal'),
    CHECK ([status]='draft' OR [status]='private' OR [status]='public'),
    FOREIGN KEY ([author_id]) REFERENCES [dbo].[Users] ([UserID])
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

CREATE TABLE [dbo].[Submission_Status] (
    [status_id] INT          IDENTITY (1, 1) NOT NULL,
    [status]    VARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([status_id] ASC)
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

CREATE TABLE [dbo].[Calls] (
    [CallID]      BIGINT       IDENTITY (1, 1) NOT NULL,
    [RoomID]      BIGINT       NOT NULL,
    [InitiatorID] BIGINT       NOT NULL,
    [Type]        VARCHAR (20) NULL,
    [Status]      VARCHAR (20) NULL,
    [StartTime]   DATETIME     DEFAULT (getdate()) NULL,
    [EndTime]     DATETIME     NULL,
    [Duration]    INT          NULL,
    PRIMARY KEY CLUSTERED ([CallID] ASC),
    CHECK ([Status]='MISSED' OR [Status]='COMPLETED' OR [Status]='ONGOING'),
    CHECK ([Type]='VIDEO' OR [Type]='AUDIO'),
    FOREIGN KEY ([InitiatorID]) REFERENCES [dbo].[Users] ([UserID]),
    FOREIGN KEY ([RoomID]) REFERENCES [dbo].[ChatRooms] ([RoomID])
);


GO

CREATE TABLE [dbo].[Likes] (
    [like_id]    BIGINT   IDENTITY (1, 1) NOT NULL,
    [user_id]    BIGINT   NOT NULL,
    [post_id]    BIGINT   NOT NULL,
    [created_at] DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([like_id] ASC),
    FOREIGN KEY ([post_id]) REFERENCES [dbo].[Posts] ([PostID]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID]),
    CONSTRAINT [FKa91dvnfnx92g2c4k7w1aw9ebu] FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID]),
    CONSTRAINT [FKnvx9seeqqyy71bij291pwiwrg] FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID]),
    CONSTRAINT [FKry8tnr4x2vwemv2bb0h5hyl0x] FOREIGN KEY ([post_id]) REFERENCES [dbo].[Posts] ([PostID]),
    CONSTRAINT [FKsrb4xtf50k8mp3wd8tf5r6s1y] FOREIGN KEY ([post_id]) REFERENCES [dbo].[Posts] ([PostID]),
    CONSTRAINT [UQ_User_Post] UNIQUE NONCLUSTERED ([user_id] ASC, [post_id] ASC)
);


GO

CREATE TABLE [dbo].[UserAchievements] (
    [UserID]        BIGINT   NOT NULL,
    [AchievementID] BIGINT   NOT NULL,
    [EarnedAt]      DATETIME DEFAULT (getdate()) NULL,
    [Progress]      INT      DEFAULT ((0)) NULL,
    PRIMARY KEY CLUSTERED ([UserID] ASC, [AchievementID] ASC),
    FOREIGN KEY ([AchievementID]) REFERENCES [dbo].[Achievements] ([AchievementID]),
    FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID])
);


GO

CREATE TABLE [dbo].[AIChatSessions] (
    [SessionID]     BIGINT       IDENTITY (1, 1) NOT NULL,
    [UserID]        BIGINT       NOT NULL,
    [Context]       TEXT         NULL,
    [Status]        VARCHAR (20) NULL,
    [CreatedAt]     DATETIME     DEFAULT (getdate()) NULL,
    [LastMessageAt] DATETIME     NULL,
    PRIMARY KEY CLUSTERED ([SessionID] ASC),
    CHECK ([Status]='FAILED' OR [Status]='COMPLETED' OR [Status]='ACTIVE'),
    FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID])
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

CREATE TABLE [dbo].[Users] (
    [UserID]           BIGINT        IDENTITY (1, 1) NOT NULL,
    [Username]         VARCHAR (50)  NOT NULL,
    [Email]            VARCHAR (100) NOT NULL,
    [Password]         VARCHAR (255) NULL,
    [FullName]         VARCHAR (100) NULL,
    [DateOfBirth]      DATE          NULL,
    [School]           VARCHAR (200) NULL,
    [Image]            VARCHAR (255) NULL,
    [CoverImage]       VARCHAR (255) NULL,
    [Bio]              TEXT          NULL,
    [Role]             VARCHAR (20)  DEFAULT ('STUDENT') NULL,
    [Status]           VARCHAR (20)  DEFAULT ('OFFLINE') NULL,
    [AccountStatus]    VARCHAR (20)  DEFAULT ('ACTIVE') NULL,
    [Provider]         VARCHAR (20)  DEFAULT ('local') NULL,
    [GoogleID]         VARCHAR (100) NULL,
    [ResetToken]       VARCHAR (255) NULL,
    [ResetTokenExpiry] DATETIME      NULL,
    [CreatedAt]        DATETIME      DEFAULT (getdate()) NULL,
    [LastLogin]        DATETIME      NULL,
    [LastLogout]       DATETIME      NULL,
    [IsDeleted]        BIT           DEFAULT ((0)) NULL,
    [full_name]        VARCHAR (255) NULL,
    [imageUrl]         VARCHAR (255) NULL,
    [AvatarUrl]        VARCHAR (255) NULL,
    PRIMARY KEY CLUSTERED ([UserID] ASC),
    CHECK ([AccountStatus]='BANNED' OR [AccountStatus]='SUSPENDED' OR [AccountStatus]='ACTIVE'),
    CHECK ([Role]='STUDENT' OR [Role]='TEACHER' OR [Role]='ADMIN'),
    CHECK ([Status]='AWAY' OR [Status]='OFFLINE' OR [Status]='ONLINE'),
    UNIQUE NONCLUSTERED ([Email] ASC),
    UNIQUE NONCLUSTERED ([Username] ASC),
    CONSTRAINT [UK_gnfv1k6flrriv6a9jh5cja03x] UNIQUE NONCLUSTERED ([Email] ASC),
    CONSTRAINT [UK_r43af9ap4edm43mmtq01oddj6] UNIQUE NONCLUSTERED ([Username] ASC)
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

CREATE TABLE [dbo].[Groups] (
    [group_id]   INT           IDENTITY (1, 1) NOT NULL,
    [group_name] VARCHAR (255) NOT NULL,
    [created_at] DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([group_id] ASC)
);


GO

CREATE TABLE [dbo].[Follows] (
    [id]           BIGINT   IDENTITY (1, 1) NOT NULL,
    [follower_id]  BIGINT   NOT NULL,
    [following_id] BIGINT   NOT NULL,
    [created_at]   DATETIME DEFAULT (getdate()) NULL,
    [followerID]   BIGINT   NOT NULL,
    [followingID]  BIGINT   NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    FOREIGN KEY ([follower_id]) REFERENCES [dbo].[Users] ([UserID]),
    FOREIGN KEY ([following_id]) REFERENCES [dbo].[Users] ([UserID]),
    CONSTRAINT [FK67hgiqbuxcx0ipf1wrjc3tigp] FOREIGN KEY ([followingID]) REFERENCES [dbo].[Users] ([UserID]),
    CONSTRAINT [FK68ly641vnf1fluejygxgq9cls] FOREIGN KEY ([followerID]) REFERENCES [dbo].[Users] ([UserID]),
    CONSTRAINT [UQ_Follower_Following] UNIQUE NONCLUSTERED ([follower_id] ASC, [following_id] ASC)
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

CREATE TABLE [dbo].[Match_User] (
    [match_user_id] INT    IDENTITY (1, 1) NOT NULL,
    [match_id]      INT    NOT NULL,
    [user_id]       BIGINT NOT NULL,
    [score]         INT    NULL,
    [rank_position] INT    NULL,
    PRIMARY KEY CLUSTERED ([match_user_id] ASC),
    CHECK ([rank_position]>=(0)),
    CHECK ([score]>=(0)),
    FOREIGN KEY ([match_id]) REFERENCES [dbo].[Match] ([match_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID])
);


GO

CREATE TABLE [dbo].[Comments] (
    [CommentID]       BIGINT             IDENTITY (1, 1) NOT NULL,
    [PostID]          BIGINT             NOT NULL,
    [UserID]          BIGINT             NOT NULL,
    [ParentCommentID] BIGINT             NULL,
    [Content]         TEXT               NOT NULL,
    [LikesCount]      INT                DEFAULT ((0)) NULL,
    [CreatedAt]       DATETIME           DEFAULT (getdate()) NULL,
    [UpdatedAt]       DATETIME           NULL,
    [IsDeleted]       BIT                DEFAULT ((0)) NULL,
    [created_at]      DATETIMEOFFSET (6) NULL,
    [post_id]         BIGINT             NULL,
    [user_id]         BIGINT             NULL,
    PRIMARY KEY CLUSTERED ([CommentID] ASC),
    FOREIGN KEY ([ParentCommentID]) REFERENCES [dbo].[Comments] ([CommentID]),
    FOREIGN KEY ([PostID]) REFERENCES [dbo].[Posts] ([PostID]),
    FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID]),
    CONSTRAINT [FKfs6xsk0i2vgrhmfo7ji7e9mv2] FOREIGN KEY ([post_id]) REFERENCES [dbo].[Posts] ([PostID]),
    CONSTRAINT [FKrcsx8irqe5xlxmb6mdpxbjhbm] FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users] ([UserID])
);


GO

CREATE NONCLUSTERED INDEX [IX_Posts_CreatedAt_Including]
    ON [dbo].[Posts]([CreatedAt] DESC)
    INCLUDE([PostID], [UserID], [Content], [LikesCount], [UpdatedAt], [IsDeleted]);


GO

CREATE NONCLUSTERED INDEX [IX_Posts_CreatedAt]
    ON [dbo].[Posts]([CreatedAt] DESC);


GO

