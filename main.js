
document.addEventListener('DOMContentLoaded', function (e) {
    let mMyBell = null;
    let mStage = null;
    let mCurrentRow = null;
    let mResultRow = null;
    let mCalling = null;
    let mBellToggled = false;

    $("#show-change-info").on("click", () => { $('#change-info').slideToggle() });
    $("#show-call-info").on("click", () => { $('#call-info').slideToggle() });
    $("#show-stage-info").on("click", () => { $('#stage-info').slideToggle() });
    $("#show-bell-info").on("click", () => { $('#bell-info').slideToggle() });

    $("#stage-input").on("change", () => {
        let val = $("#stage-input").val();
        val = Math.min(Math.max(val, 3), 16);
        $("#stage-input").val(val)

        $('#bell-input').attr('max', val);
        $('#bell-input').val(Math.min($('#bell-input').val(), val));
    })

    $("#bell-input").on("change", () => {
        let val = $("#bell-input").val();
        val = Math.min(Math.max(1, val), $("#stage-input").val());
        $("#bell-input").val(val);
    })

    $("#start-button").on("click", () => {
        mStage = parseInt($("#stage-input").val());
        mCurrentRow = [...Array(mStage).keys()].map(v => v + 1);
        mResultRow = mCurrentRow;
        mMyBell = parseInt($("#bell-input").val());
        mCalling = $("#call-input").val()

        let following = $("#following-input");
        following.empty();

        following.append($("<li>")
            .append($("<input>").attr("type", "radio")
                .attr("name", "following")
                .attr("value", 0))
            .append($("<span>")
                .html("I'm leading")))
        mCurrentRow.forEach(val => {
            following.append($("<li>")
                .append($("<input>").attr("type", "radio")
                    .attr("name", "following")
                    .attr("value", val))
                .append($("<span>")
                    .html(val)))
        })

        let place = $("#place-input");
        place.empty();
        mCurrentRow.forEach(val => {
            place.append($("<li>")
                .append($("<input>").attr("type", "radio")
                    .attr("type", "radio")
                    .attr("name", "place")
                    .attr("value", val))
                .append($("<span>")
                    .html(val == 1 ? "lead" : val)))
        })

        $("#current-row").html(mCurrentRow.join(" "));

        // hide all the result interface stuff except what we want
        $(".results").hide();
        $("#message").html("Please input your place and who you will be following after the call, then check your answer below.").show();
        $("#check-answer").show();

        $("#tower-setup").slideToggle();
        $("#ringing-chamber").slideToggle();
    })

    $("#back-button").on("click", () => {
        $("#tower-setup").slideToggle();
        $("#ringing-chamber").slideToggle();
    })

    $("#show-row").on("click", () => {
        $("#current-row-div").slideToggle();
    })

    $("#check-answer").on("click", () => {
        let following = $('input[name="following"]:checked').val();
        let place = $('input[name="place"]:checked').val();

        // hide all the result interface stuff except what we want
        $(".results").hide();
        if (following == undefined || place == undefined) {
            $("#message").html("Please input your place and who you will be following after the call, then check your answer below.").show();
            $("#check-answer").show();
        } else {
            let index = mResultRow.indexOf(mMyBell);
            let correctPlace = index + 1;
            let correctFollowing = index == 0 ? 0 : mResultRow[index - 1];
            if (correctFollowing == following && correctPlace == place) {
                $("#message").html("Correct!").show();
                $("#next-call").show();
                toggleBell();
            } else {
                let message = "";
                if (correctFollowing != following) message += "Following bell is incorrect. "
                if (correctPlace != place) message += "Place is incorrect."
                $("#message").html(message).show();
                $("#check-answer").show();
                $("#show-answer").show();
            }
        }
    });

    function toggleBell() {
        let bell = $('#bell-img');
        let from = mBellToggled ? -270 : 0;
        let to = mBellToggled ? 0 : -270;
        mBellToggled = !mBellToggled;
        $({ deg: from }).animate({ deg: to }, {
            duration: 1000,
            step: function (now) {
                bell.css({
                    transform: 'rotate(' + now + 'deg)'
                });
            }
        });
    }

    $("#show-answer").on("click", () => {
        let index = mResultRow.indexOf(mMyBell);
        if (index == -1) {
            console.error("Error! For some reason your bell isn't in the row.");
            $("#message").html("Error! We don't know what the right answer is 😅");
            return;
        }
        let followingMessage = index == 0 ? "I am leading" : "I am following " + mResultRow[index - 1];
        $("#message").html("I am bell " + mMyBell + ", I am in place " + (index + 1) + ",  " + followingMessage);
    });

    $("#next-call").on("click", () => {
        mCurrentRow = mResultRow;
        $("#current-row").html(mCurrentRow.join(" "));

        let index = Math.floor(Math.random() * (mStage - 1));

        mResultRow = [...mCurrentRow];
        let movingBell = mResultRow.splice(index, 1)[0];
        mResultRow.splice(index + 1, 0, movingBell)

        let call;
        if (mCalling === "up") {
            call = mCurrentRow[index] + " to " + mCurrentRow[index + 1];
        } else {
            call = mCurrentRow[index + 1] + " to " + (index == 0 ? "lead" : mCurrentRow[index - 1])
        }

        $("#call").html(call);
        $(".results").hide();
        $("#check-answer").show();
    });
})