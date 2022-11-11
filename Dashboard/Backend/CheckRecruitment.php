<?php

namespace com\OHT\Lib\api2\Recruitment;

use com\OHT\Lib\api2\CommandFullAuthAbstract;
use OHT\Services\RecruitmentService;
use Translator;

/**
 * @api {get} /recruitment/check
 *
 * @apiName CheckRecruitment
 * @apiDescription Check if user language pair is in recruitment
 * @apiGroup Recruitment
 * @apiVersion 2.1.0
 * @apiPermission Translator
 *
 * @apiUse StatusSuccessResponse
 *
 * @apiSuccess {Bool} results.available Is recruitment for the specified user and language pair available.
 */
class CheckRecruitment extends CommandFullAuthAbstract
{
    protected function _execute()
    {
        $user = $this->getUser();
        $result = true;

        if ($user instanceof Translator
            && Translator::STATUS_PENDING == $user->getTranslatorStatus()
        ) {
            $service = new RecruitmentService($user);
            $result = $service->isRecruiting();
        }

        $this->responseObj->results = ['available' => $result];

        return $this;
    }
}
